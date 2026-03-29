import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiRefreshCw } from 'react-icons/fi';
import '../Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', captcha_code: '' });
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
      const res = await api.post('/auth/login', {
        ...form,
        captcha_id: captcha.captcha_id,
      });
      login(res.data.data.user, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      navigate('/');
    } finally {
      setLoading(false);
      fetchCaptcha(); // refresh captcha after attempt
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeIn">
        <div className="auth-header">
          <span className="auth-logo">🌿</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your Tazaura account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Username"
            icon={<FiUser />}
            type="text"
            placeholder="your_username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <Input
            label="Password"
            icon={<FiLock />}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {/* CAPTCHA */}
          <div className="captcha-row">
            {captcha ? (
              <div className="captcha-box">
                <span className="captcha-code">{captcha.code}</span>
              </div>
            ) : (
              <button type="button" className="captcha-load" onClick={fetchCaptcha}>
                Click to load CAPTCHA
              </button>
            )}
            <button type="button" className="captcha-refresh" onClick={fetchCaptcha} title="Refresh">
              <FiRefreshCw />
            </button>
            <Input
              placeholder="Enter captcha"
              value={form.captcha_code}
              onChange={(e) => setForm({ ...form, captcha_code: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Login
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
