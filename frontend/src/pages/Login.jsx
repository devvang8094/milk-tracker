import { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Milk, Eye, EyeOff, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CowViewer from '../components/CowViewer';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Client Validation
    if (phoneNumber.length < 10 || phoneNumber.length > 12) {
      setError(t('invalid_phone'));
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(phoneNumber, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 transition-colors">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">

        {/* Left: 3D Visual Section (Hidden on mobile if needed, or stacked) */}
        {/* Left: Visual Section (Video) */}
        <div className="hidden md:block w-full md:w-1/2 bg-blue-50 relative min-h-[400px]">
          {/* Main Viewer - Full Bleed */}
          <div className="absolute inset-0">
            <CowViewer />
          </div>

          {/* NO Text Overlay Here - Kept pure visual as requested */}
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 relative">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title="Switch Language"
          >
            <div className="flex items-center gap-1 text-xs font-bold">
              <Globe size={16} />
              {lang === 'en' ? 'HI' : 'EN'}
            </div>
          </button>




          <div className="text-center mb-8">
            {/* Fallback Icon only if Video is disabled or load issues (optional, but CowViewer handles fallback internally) */}
            {/* We hide the original blue icon circle since we have a video now */}
            <div className="hidden">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4 md:hidden">
                <Milk size={24} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">{t('login_title')}</h1>
            <p className="text-slate-500 mt-2 text-sm">{t('login_subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('phone_number')}</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ''); // Numeric only
                  setPhoneNumber(val);
                }}
                className="input-field font-mono tracking-widest"
                placeholder="9876543210"
                maxLength="12"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const number = phoneNumber || '_____';
                  const message = lang === 'en'
                    ? `Hello Admin,\nI forgot my password.\nMy registered mobile number is: ${number}\nPlease reset my password.`
                    : `नमस्ते एडमिन,\nमैं अपना पासवर्ड भूल गया/गई हूँ।\nमेरा रजिस्टर्ड मोबाइल नंबर: ${number}\nकृपया पासवर्ड रीसेट करें।`;

                  const url = `https://wa.me/917878423710?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                {t('forgot_password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10 || password.length < 4}
              className="w-full btn btn-primary py-3 mt-4 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('logging_in')}
                </>
              ) : t('login_btn')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t('no_account')} {' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              {t('signup_btn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
