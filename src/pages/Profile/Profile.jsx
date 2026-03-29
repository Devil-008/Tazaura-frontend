import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, login, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [addrForm, setAddrForm] = useState({ full_name:'', phone:'', line1:'', city:'', state:'', pincode:'', is_default:false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profile').then((r) => {
      setProfile(r.data.data);
      setEditForm({ name: r.data.data.name, email: r.data.data.email, password: '' });
    });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', editForm);
      toast.success('Profile updated!');
      // update auth context with new name/email
      login({ ...user, name: editForm.name, email: editForm.email }, token);
    } finally { setSaving(false); }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    await api.post('/profile/addresses', addrForm);
    toast.success('Address added!');
    const r = await api.get('/profile');
    setProfile(r.data.data);
    setAddrForm({ full_name:'', phone:'', line1:'', city:'', state:'', pincode:'', is_default:false });
  };

  const deleteAddress = async (id) => {
    await api.delete(`/profile/addresses/${id}`);
    toast.success('Address deleted');
    const r = await api.get('/profile');
    setProfile(r.data.data);
  };

  if (!profile) return <div className="page-center"><div className="skeleton" style={{ width: 500, height: 300 }} /></div>;

  return (
    <div className="profile-page container animate-fadeIn">
      <h1 className="page-title">My Profile</h1>
      <div className="profile-grid">
        {/* Edit profile */}
        <section className="profile-card">
          <h2>Account Details</h2>
          <form onSubmit={saveProfile} className="profile-form">
            <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <Input label="New Password (optional)" type="password" placeholder="Leave blank to keep current" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
          </form>
        </section>

        {/* Addresses */}
        <section className="profile-card">
          <h2>Saved Addresses</h2>
          {profile.addresses?.length === 0 && <p className="no-addr">No addresses saved yet.</p>}
          {profile.addresses?.map((addr) => (
            <div key={addr.id} className="saved-addr">
              <div>
                <strong>{addr.full_name}</strong> · {addr.phone}
                <p>{addr.line1}, {addr.city}, {addr.state} – {addr.pincode}</p>
              </div>
              <button className="del-addr" onClick={() => deleteAddress(addr.id)}>✕</button>
            </div>
          ))}
          <h3 style={{ marginTop: '1.5rem' }}>Add New Address</h3>
          <form onSubmit={addAddress} className="profile-form" style={{ marginTop: '0.75rem' }}>
            <div className="form-row">
              <Input label="Full Name" value={addrForm.full_name} onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })} required />
              <Input label="Phone" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} required />
            </div>
            <Input label="Address Line 1" value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} required />
            <div className="form-row">
              <Input label="City"    value={addrForm.city}    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required />
              <Input label="State"   value={addrForm.state}   onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} required />
              <Input label="Pincode" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} required />
            </div>
            <Button type="submit" variant="ghost">Add Address</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
