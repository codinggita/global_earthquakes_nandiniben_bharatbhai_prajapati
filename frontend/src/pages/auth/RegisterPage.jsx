import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerUser, clearError,
  selectAuthLoading, selectAuthError, selectIsAuthenticated,
} from '@features/auth/authSlice';
import { toastSuccess, toastError } from '@features/ui/uiSlice';
import { ROUTES } from '@config/constants';

const RegisterPage = () => {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading         = useSelector(selectAuthLoading);
  const authError       = useSelector(selectAuthError);

  const [form,   setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name     = 'Name must be at least 2 characters';
    if (!form.email)                                e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email    = 'Enter a valid email';
    if (!form.password)                              e.password = 'Password is required';
    else if (form.password.length < 6)               e.password = 'Minimum 6 characters';
    if (form.confirm !== form.password)              e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    const { confirm, ...payload } = form;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      dispatch(toastSuccess('Account created! Welcome to EarthWatch.'));
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      dispatch(toastError(result.payload || 'Registration failed.'));
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-lg bg-slate-950/70 border text-slate-100 text-sm
     placeholder-slate-600 outline-none transition-all duration-150
     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
     ${errors[field] ? 'border-red-500' : 'border-slate-700'}`;

  const fields = [
    { id: 'reg-name',     name: 'name',     type: 'text',     label: 'Full Name',        auto: 'name',         ph: 'Jane Doe' },
    { id: 'reg-email',    name: 'email',    type: 'email',    label: 'Email address',    auto: 'email',        ph: 'you@example.com' },
    { id: 'reg-password', name: 'password', type: 'password', label: 'Password',         auto: 'new-password', ph: 'Min. 6 characters' },
    { id: 'reg-confirm',  name: 'confirm',  type: 'password', label: 'Confirm Password', auto: 'new-password', ph: 'Repeat your password' },
  ];

  return (
    <div id="register-page" className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] animate-fade-in-up
                      bg-slate-900/60 backdrop-blur-xl border border-slate-700/50
                      rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-5">

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl">🌍</span>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text">Create Account</h1>
          <p className="text-xs text-slate-500">Join the Global Earthquake Analytics Platform</p>
        </div>

        {authError && (
          <div role="alert" className="px-4 py-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
            {authError}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
          {fields.map(({ id, name, type, label, auto, ph }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>
              <input
                id={id} name={name} type={type} autoComplete={auto} placeholder={ph}
                value={form[name]} onChange={handleChange}
                className={inputClass(name)}
              />
              {errors[name] && <span className="text-xs text-red-400">{errors[name]}</span>}
            </div>
          ))}

          <button
            id="btn-register-submit" type="submit" disabled={loading}
            className="w-full h-12 mt-1 rounded-lg font-semibold text-white text-sm
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       shadow-[0_0_20px_rgba(37,99,235,0.35)]
                       hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] hover:-translate-y-px
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-slate-600 text-xs">
          <span className="flex-1 h-px bg-slate-800" />or<span className="flex-1 h-px bg-slate-800" />
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link id="link-to-login" to={ROUTES.LOGIN} className="text-blue-400 font-semibold hover:text-blue-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
