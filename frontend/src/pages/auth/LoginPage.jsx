import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser, clearError,
  selectAuthLoading, selectAuthError, selectIsAuthenticated,
} from '@features/auth/authSlice';
import { toastSuccess, toastError } from '@features/ui/uiSlice';
import { ROUTES } from '@config/constants';

const LoginPage = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const location        = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading         = useSelector(selectAuthLoading);
  const authError       = useSelector(selectAuthError);
  const from            = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const validate = () => {
    const e = {};
    if (!form.email)                           e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Enter a valid email';
    if (!form.password)                         e.password = 'Password is required';
    else if (form.password.length < 6)          e.password = 'Minimum 6 characters';
    return e;
  };

  const handleChange = (e) => {
    setForm((f)  => ({ ...f,  [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      dispatch(toastSuccess('Welcome back! Login successful.'));
      navigate(from, { replace: true });
    } else {
      dispatch(toastError(result.payload || 'Login failed.'));
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-lg text-sm text-slate-100 placeholder-slate-600
     bg-slate-950/70 border outline-none transition-all duration-150
     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
     ${errors[field] ? 'border-red-500' : 'border-slate-700'}`;

  return (
    <div id="login-page" className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up flex flex-col gap-6
                      bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl px-8 py-10">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl drop-shadow-[0_0_16px_rgba(37,99,235,0.5)]">🌍</span>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text">EarthWatch</h1>
          <p className="text-xs text-slate-500 tracking-wide">Global Earthquake Analytics Platform</p>
        </div>

        {/* API error */}
        {authError && (
          <div role="alert" className="px-4 py-3 rounded-lg text-sm text-red-300 bg-red-900/20 border border-red-500/30">
            {authError}
          </div>
        )}

        {/* Form */}
        <form id="login-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-medium text-slate-400 tracking-wide">Email address</label>
            <input id="login-email" name="email" type="email" autoComplete="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange}
              className={inputCls('email')} />
            {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-xs font-medium text-slate-400 tracking-wide">Password</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password"
              placeholder="••••••••" value={form.password} onChange={handleChange}
              className={inputCls('password')} />
            {errors.password && <span className="text-xs text-red-400">{errors.password}</span>}
          </div>

          <button id="btn-login-submit" type="submit" disabled={loading}
            className="w-full h-12 mt-1 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)]
                       hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex-1 h-px bg-slate-800" />or<span className="flex-1 h-px bg-slate-800" />
        </div>

        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link id="link-to-register" to={ROUTES.REGISTER}
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
