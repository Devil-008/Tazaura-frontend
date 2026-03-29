import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../utils/image';
import '../Admin.css';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [view, setView]     = useState('dashboard'); // dashboard | products | orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [prodModal, setProdModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [prodForm, setProdForm]   = useState({ name:'', category:'', price:'', mrp:'', stock:'', unit:'250g', description:'', is_featured:0 });
  const [images, setImages]       = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data));
  }, []);
  useEffect(() => {
    if (view === 'products') api.get('/products', { params: { per_page: 50 } }).then((r) => setProducts(r.data.data.products));
    if (view === 'orders')   api.get('/admin/orders').then((r) => setOrders(r.data.data));
  }, [view]);

  const openAddModal = () => {
    setEditingProductId(null);
    setProdForm({ name:'', category:'', price:'', mrp:'', stock:'', unit:'250g', description:'', is_featured:0 });
    setImages([]);
    setExistingImages([]);
    setProdModal(true);
  };

  const openEditModal = async (p) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name || '',
      category: p.category || '',
      price: p.price || '',
      mrp: p.mrp || '',
      stock: p.stock || 0,
      unit: p.unit || '',
      description: p.description || '',
      is_featured: p.is_featured || 0,
    });
    setImages([]);
    setExistingImages([]);
    setProdModal(true);
    
    // Fetch full product details to get all images
    try {
      const res = await api.get(`/products/${p.id}`);
      setExistingImages(res.data.data.images || []);
    } catch(err) {
      console.error(err);
    }
  };

  const deleteExistingImage = async (imageId) => {
    if(!confirm("Delete this image?")) return;
    try {
      await api.delete(`/admin/products/${editingProductId}/images/${imageId}`);
      setExistingImages(existing => existing.filter(img => img.id !== imageId));
      toast.success("Image deleted");
    } catch(err) {}
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, prodForm);
        // Upload any newly selected images for this existing product
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('image', images[i]);
          formData.append('is_primary', (i === 0 && existingImages.length === 0) ? 1 : 0);
          await api.post(`/admin/products/${editingProductId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        toast.success('Product updated successfully!');
      } else {
        const res = await api.post('/admin/products', prodForm);
        const newProductId = res.data.data.product_id;

        // Upload images sequentially for new product
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('image', images[i]);
          formData.append('is_primary', i === 0 ? 1 : 0);
          await api.post(`/admin/products/${newProductId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Product created successfully!');
      }

      setProdModal(false);
      setImages([]);
      setProdForm({ name:'', category:'', price:'', mrp:'', stock:'', unit:'250g', description:'', is_featured:0 });
      setEditingProductId(null);
      api.get('/products', { params: { per_page: 50 } }).then((r) => setProducts(r.data.data.products));
    } finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    await api.delete(`/admin/products/${id}`);
    toast.success('Product deactivated');
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  const updateOrderStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}`, { status });
    toast.success('Status updated');
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));
  };

  const STATUS_OPTIONS = ['pending','paid','processing','shipped','delivered','cancelled'];
  const CATS = ['Nuts','Dates','Dry Fruits','Oats','Mixes'];

  return (
    <div className="admin-page container animate-fadeIn">
      <div className="admin-header">
        <h1 className="admin-title">🛠 Admin Panel</h1>
        <div className="admin-tabs">
          {['dashboard','products','orders'].map((t) => (
            <button key={t} className={`admin-tab${view===t?' active':''}`} onClick={() => setView(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && stats && (
        <>
          <div className="stats-grid">
            {[
              { label: 'Total Users',    value: stats.total_users,    icon: '👤' },
              { label: 'Total Orders',   value: stats.total_orders,   icon: '📦' },
              { label: 'Revenue',        value: `₹${parseFloat(stats.total_revenue).toFixed(0)}`, icon: '💰' },
              { label: 'Active Products',value: stats.total_products, icon: '🥜' },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <span className="stat-icon">{s.icon}</span>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="section-heading" style={{ marginTop: '2rem' }}>Recent Orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recent_orders?.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer}</td>
                    <td>₹{parseFloat(o.total_price).toFixed(2)}</td>
                    <td><span className="admin-badge">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Products */}
      {view === 'products' && (
        <>
          <div className="admin-toolbar">
            <h2 className="section-heading">Products</h2>
            <Button variant="primary" onClick={openAddModal}>+ Add Product</Button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img src={getImageUrl(p.image)} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="tbl-btn" onClick={() => openEditModal(p)} style={{ background: 'var(--clr-surface-2)', color: 'var(--clr-text)' }}>Edit</button>
                        <button className="tbl-btn danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal open={prodModal} onClose={() => setProdModal(false)} title={editingProductId ? "Edit Product" : "Add Product"} size="md">
            <form onSubmit={saveProduct} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <Input label="Name" value={prodForm.name} onChange={(e) => setProdForm({...prodForm,name:e.target.value})} required />
                <div className="taz-field">
                  <label className="taz-label">Category</label>
                  <select className="taz-input" value={prodForm.category} onChange={(e) => setProdForm({...prodForm,category:e.target.value})} required>
                    <option value="">Select…</option>
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Price (₹)"  type="number" value={prodForm.price}  onChange={(e) => setProdForm({...prodForm,price:e.target.value})} required />
                <Input label="MRP (₹)"    type="number" value={prodForm.mrp}    onChange={(e) => setProdForm({...prodForm,mrp:e.target.value})} />
                <Input label="Stock"      type="number" value={prodForm.stock}  onChange={(e) => setProdForm({...prodForm,stock:e.target.value})} required />
                <Input label="Unit"       value={prodForm.unit}    onChange={(e) => setProdForm({...prodForm,unit:e.target.value})} />
              </div>
              
              <div className="taz-field" style={{ marginTop: '0.5rem' }}>
                <label className="taz-label">{editingProductId ? "Add More Images" : "Images (Select multiple)"}</label>
                
                {editingProductId && existingImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {existingImages.map(img => (
                      <div key={img.id} style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <img src={getImageUrl(img.image_url)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'4px', border:'1px solid var(--clr-border)' }} />
                        <button type="button" onClick={() => deleteExistingImage(img.id)} style={{ position: 'absolute', top: -5, right: -5, background: 'var(--clr-error)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                
                <input type="file" multiple accept="image/*" className="taz-input" onChange={(e) => setImages(Array.from(e.target.files))} />
                {images.length > 0 && <span style={{fontSize:'12px', color:'var(--clr-text-muted)'}}>{images.length} new file(s) selected</span>}
              </div>

              <div className="taz-field">
                <label className="taz-label">Description</label>
                <textarea className="taz-input" rows={3} value={prodForm.description} onChange={(e) => setProdForm({...prodForm,description:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <label style={{ display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'var(--fs-sm)', fontWeight:600 }}>
                <input type="checkbox" checked={!!prodForm.is_featured} onChange={(e) => setProdForm({...prodForm,is_featured:e.target.checked?1:0})} />
                Feature this product
              </label>
              <Button type="submit" variant="primary" loading={saving} fullWidth>{editingProductId ? "Update Product" : "Create Product"}</Button>
            </form>
          </Modal>
        </>
      )}

      {/* Orders */}
      {view === 'orders' && (
        <>
          <h2 className="section-heading">All Orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Change Status</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer}</td>
                    <td style={{ fontSize:'var(--fs-sm)' }}>{o.email}</td>
                    <td>₹{parseFloat(o.total_price).toFixed(2)}</td>
                    <td><span className="admin-badge">{o.status}</span></td>
                    <td>
                      <select className="status-select"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                        {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
