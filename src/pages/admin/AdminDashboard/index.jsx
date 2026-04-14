import { useEffect, useRef, useState } from 'react';
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
  const [view, setView]     = useState('dashboard'); // dashboard | products | orders | banners

  /* ── Products state ── */
  const [products, setProducts] = useState([]);
  const [prodModal, setProdModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [prodForm, setProdForm] = useState({ name:'', category:'', price:'', mrp:'', stock:'', unit:'250g', description:'', is_featured:0 });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  /* ── Orders state ── */
  const [orders, setOrders] = useState([]);

  /* ── Banners state ── */
  const [banners, setBanners]          = useState([]);
  const [bannerForm, setBannerForm]    = useState({ title:'', subtitle:'', link:'', sort_order:0 });
  const [bannerFile, setBannerFile]    = useState(null);
  const [bannerSaving, setBannerSaving]= useState(false);
  const bannerFileRef = useRef(null);

  /* ── Data loading ── */
  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setStats(r.data.data));
  }, []);

  useEffect(() => {
    if (view === 'products') api.get('/products', { params: { per_page: 50 } }).then((r) => setProducts(r.data.data.products));
    if (view === 'orders')   api.get('/admin/orders').then((r) => setOrders(r.data.data));
    if (view === 'banners')  fetchBanners();
  }, [view]);

  const fetchBanners = () => {
    api.get('/admin/banners').then((r) => setBanners(r.data.data || []));
  };

  /* ── Product helpers ── */
  const openAddModal = () => {
    setEditingProductId(null);
    setProdForm({ name:'', category:'', price:'', mrp:'', stock:'', unit:'250g', description:'', is_featured:0 });
    setImages([]);
    setExistingImages([]);
    setProdModal(true);
  };

  const openEditModal = async (p) => {
    setEditingProductId(p.id);
    setProdForm({ name:p.name||'', category:p.category||'', price:p.price||'', mrp:p.mrp||'', stock:p.stock||0, unit:p.unit||'', description:p.description||'', is_featured:p.is_featured||0 });
    setImages([]);
    setExistingImages([]);
    setProdModal(true);
    try {
      const res = await api.get(`/products/${p.id}`);
      setExistingImages(res.data.data.images || []);
    } catch { /* ignore */ }
  };

  const deleteExistingImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/products/${editingProductId}/images/${imageId}`);
      setExistingImages((ex) => ex.filter((img) => img.id !== imageId));
      toast.success('Image deleted');
    } catch { /* ignore */ }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProductId) {
        await api.put(`/admin/products/${editingProductId}`, prodForm);
        for (let i = 0; i < images.length; i++) {
          const fd = new FormData();
          fd.append('image', images[i]);
          fd.append('is_primary', (i === 0 && existingImages.length === 0) ? 1 : 0);
          await api.post(`/admin/products/${editingProductId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        toast.success('Product updated!');
      } else {
        const res = await api.post('/admin/products', prodForm);
        const newId = res.data.data.product_id;
        for (let i = 0; i < images.length; i++) {
          const fd = new FormData();
          fd.append('image', images[i]);
          fd.append('is_primary', i === 0 ? 1 : 0);
          await api.post(`/admin/products/${newId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        toast.success('Product created!');
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

  /* ── Banner helpers ── */
  const saveBanner = async (e) => {
    e.preventDefault();
    if (!bannerFile) { toast.error('Please select an image'); return; }
    setBannerSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', bannerFile);
      fd.append('title',      bannerForm.title);
      fd.append('subtitle',   bannerForm.subtitle);
      fd.append('link',       bannerForm.link);
      fd.append('sort_order', bannerForm.sort_order);
      await api.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Banner created!');
      setBannerForm({ title:'', subtitle:'', link:'', sort_order:0 });
      setBannerFile(null);
      if (bannerFileRef.current) bannerFileRef.current.value = '';
      fetchBanners();
    } finally { setBannerSaving(false); }
  };

  const deleteBanner = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/admin/banners/${id}`);
    toast.success('Banner deleted');
    setBanners((b) => b.filter((x) => x.id !== id));
  };

  const STATUS_OPTIONS = ['pending','paid','processing','shipped','delivered','cancelled'];
  const CATS = ['Nuts','Dates','Dry Fruits','Oats','Mixes'];
  const TABS = ['dashboard', 'products', 'orders', 'banners'];

  return (
    <div className="admin-page container animate-fadeIn">
      <div className="admin-header">
        <h1 className="admin-title">🛠 Admin Panel</h1>
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={`admin-tab${view === t ? ' active' : ''}`} onClick={() => setView(t)}>
              {t === 'banners' ? '🖼 Banners' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Dashboard ── */}
      {view === 'dashboard' && stats && (
        <>
          <div className="stats-grid">
            {[
              { label:'Total Users',     value: stats.total_users,    icon:'👤' },
              { label:'Total Orders',    value: stats.total_orders,   icon:'📦' },
              { label:'Revenue',         value: `₹${parseFloat(stats.total_revenue).toFixed(0)}`, icon:'💰' },
              { label:'Active Products', value: stats.total_products, icon:'🥜' },
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
          <h2 className="section-heading" style={{ marginTop:'2rem' }}>Recent Orders</h2>
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

      {/* ── Products ── */}
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
                    <td><img src={getImageUrl(p.image)} alt={p.name} style={{ width:40, height:40, objectFit:'cover', borderRadius:4 }} /></td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button className="tbl-btn" onClick={() => openEditModal(p)} style={{ background:'var(--clr-surface-2)', color:'var(--clr-text)' }}>Edit</button>
                        <button className="tbl-btn danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal open={prodModal} onClose={() => setProdModal(false)} title={editingProductId ? 'Edit Product' : 'Add Product'} size="md">
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
                <Input label="Price (₹)"  type="number" value={prodForm.price}  onChange={(e) => setProdForm({...prodForm,price:e.target.value})}  required />
                <Input label="MRP (₹)"    type="number" value={prodForm.mrp}    onChange={(e) => setProdForm({...prodForm,mrp:e.target.value})} />
                <Input label="Stock"      type="number" value={prodForm.stock}  onChange={(e) => setProdForm({...prodForm,stock:e.target.value})} required />
                <Input label="Unit"       value={prodForm.unit} onChange={(e) => setProdForm({...prodForm,unit:e.target.value})} />
              </div>

              <div className="taz-field" style={{ marginTop:'0.5rem' }}>
                <label className="taz-label">{editingProductId ? 'Add More Images' : 'Images (Multiple allowed)'}</label>
                {editingProductId && existingImages.length > 0 && (
                  <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
                    {existingImages.map((img) => (
                      <div key={img.id} style={{ position:'relative', width:'60px', height:'60px' }}>
                        <img src={getImageUrl(img.image_url)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'4px', border:'1px solid var(--clr-border)' }} />
                        <button type="button" onClick={() => deleteExistingImage(img.id)} style={{ position:'absolute', top:-5, right:-5, background:'var(--clr-error)', color:'#fff', borderRadius:'50%', width:'20px', height:'20px', fontSize:'12px', border:'none', cursor:'pointer', display:'grid', placeItems:'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" multiple accept="image/*" className="taz-input" onChange={(e) => setImages(Array.from(e.target.files))} />
                {images.length > 0 && <span style={{ fontSize:'12px', color:'var(--clr-text-muted)' }}>{images.length} new file(s) selected</span>}
              </div>

              <div className="taz-field">
                <label className="taz-label">Description</label>
                <textarea className="taz-input" rows={3} value={prodForm.description} onChange={(e) => setProdForm({...prodForm,description:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <label style={{ display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'var(--fs-sm)', fontWeight:600 }}>
                <input type="checkbox" checked={!!prodForm.is_featured} onChange={(e) => setProdForm({...prodForm,is_featured:e.target.checked?1:0})} />
                Feature this product
              </label>
              <Button type="submit" variant="primary" loading={saving} fullWidth>{editingProductId ? 'Update Product' : 'Create Product'}</Button>
            </form>
          </Modal>
        </>
      )}

      {/* ── Orders ── */}
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
                      <select className="status-select" value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
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

      {/* ── Banners ── */}
      {view === 'banners' && (
        <>
          <div className="admin-toolbar">
            <h2 className="section-heading">🖼 Landing Page Banners</h2>
          </div>
          <p style={{ color:'var(--clr-text-muted)', marginBottom:'1.5rem', fontSize:'var(--fs-sm)' }}>
            Banners appear as a full-width carousel on the landing page (between the hero and category sections). Upload images in <strong>16:5</strong> ratio (e.g. 1600×500px) for best results.
          </p>

          {/* Upload form */}
          <div className="banner-upload-card">
            <h3 style={{ marginBottom:'1.2rem', font:'700 var(--fs-lg)/1 var(--font-sans)' }}>Upload New Banner</h3>
            <form onSubmit={saveBanner} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div className="taz-field">
                  <label className="taz-label">Title (optional)</label>
                  <input className="taz-input" value={bannerForm.title} onChange={(e) => setBannerForm({...bannerForm,title:e.target.value})} placeholder="e.g. Summer Sale" />
                </div>
                <div className="taz-field">
                  <label className="taz-label">Link (optional)</label>
                  <input className="taz-input" value={bannerForm.link} onChange={(e) => setBannerForm({...bannerForm,link:e.target.value})} placeholder="/products?category=Nuts" />
                </div>
                <div className="taz-field" style={{ gridColumn:'1/-1' }}>
                  <label className="taz-label">Subtitle (optional)</label>
                  <input className="taz-input" value={bannerForm.subtitle} onChange={(e) => setBannerForm({...bannerForm,subtitle:e.target.value})} placeholder="e.g. Up to 30% off on all nuts" />
                </div>
                <div className="taz-field">
                  <label className="taz-label">Sort Order</label>
                  <input className="taz-input" type="number" value={bannerForm.sort_order} onChange={(e) => setBannerForm({...bannerForm,sort_order:parseInt(e.target.value)||0})} />
                </div>
                <div className="taz-field">
                  <label className="taz-label">Banner Image *</label>
                  <input ref={bannerFileRef} type="file" accept="image/*" className="taz-input" onChange={(e) => setBannerFile(e.target.files[0] || null)} required />
                </div>
              </div>
              <Button type="submit" variant="primary" loading={bannerSaving} style={{ alignSelf:'flex-start' }}>
                Upload Banner
              </Button>
            </form>
          </div>

          {/* Existing banners grid */}
          {banners.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'var(--clr-text-muted)', border:'2px dashed var(--clr-border)', borderRadius:'var(--radius-lg)', marginTop:'1.5rem' }}>
              <p style={{ fontSize:'2.5rem' }}>🖼</p>
              <p style={{ marginTop:'0.5rem' }}>No banners yet. Upload your first banner above!</p>
            </div>
          ) : (
            <div className="banners-grid">
              {banners.map((b) => (
                <div key={b.id} className="banner-admin-card">
                  <img src={getImageUrl(b.image_url)} alt={b.title || 'Banner'} className="banner-admin-img" />
                  <div className="banner-admin-info">
                    {b.title    && <strong>{b.title}</strong>}
                    {b.subtitle && <p>{b.subtitle}</p>}
                    <span className="banner-admin-meta">Sort: {b.sort_order} · {b.is_active ? '✅ Active' : '⏸ Inactive'}</span>
                  </div>
                  <button className="tbl-btn danger" onClick={() => deleteBanner(b.id)} style={{ margin:'0.75rem' }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
