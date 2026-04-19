import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiMail, FiRefreshCw } from 'react-icons/fi';
import TazauraLogo from '../../assets/SVG 2.svg';
import '../Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', captcha_code: '' });
  const [captcha, setCaptcha] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    const res = await api.post('/auth/captcha');
    setCaptcha(res.data.data);
  };

  useEffect(() => {
    fetchCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captcha) return toast.error('Please load the captcha first');
    setLoading(true);
    try {
      await api.post('/auth/register', { ...form, captcha_id: captcha.captcha_id });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } finally {
      setLoading(false);
      fetchCaptcha();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeIn">
        <div className="auth-header">
          <span className="auth-logo">
            <img src={TazauraLogo} alt="Tazaura Logo" className="tazaura-svg-logo" style={{ width: '100px', height: 'auto', display: 'block', margin: '0 auto' }} />
          </span>
          <h1>Create Account</h1>
          <p>Join the Tazaura family today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input label="Full Name" icon={<FiUser />} placeholder="John Doe" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Username" icon={<FiUser />} placeholder="johndoe" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <Input label="Email" icon={<FiMail />} type="email" placeholder="john@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" icon={<FiLock />} type="password" placeholder="••••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          {/* CAPTCHA */}
          <div className="captcha-row">
            {captcha ? (
              <div className="captcha-box"><span className="captcha-code">{captcha.code}</span></div>
            ) : (
              <button type="button" className="captcha-load" onClick={fetchCaptcha}>Click to load CAPTCHA</button>
            )}
            <button type="button" className="captcha-refresh" onClick={fetchCaptcha} title="Refresh">
              <FiRefreshCw />
            </button>
            <Input placeholder="Enter captcha" value={form.captcha_code}
              onChange={(e) => setForm({ ...form, captcha_code: e.target.value })} required />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
