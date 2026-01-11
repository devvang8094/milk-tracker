import { useState } from 'react';
import { signupUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Milk, Globe, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CowViewer from '../components/CowViewer';

function Signup() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { t, lang, setLang } = useLanguage();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (phoneNumber.length < 10) {
            setError(t('invalid_phone'));
            return;
        }

        if (password !== confirmPassword) {
            setError(t('password_mismatch'));
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const data = await signupUser(phoneNumber, password);
            localStorage.setItem('token', data.token);
            // Default rate is handled by backend now
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">

                {/* Language Toggle */}
                <button
                    onClick={toggleLang}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                    title="Switch Language"
                >
                    <div className="flex items-center gap-1 text-xs font-bold">
                        <Globe size={16} />
                        {lang === 'en' ? 'HI' : 'EN'}
                    </div>
                </button>




                <div className="text-center mb-8">
                    {/* Hide default icon */}
                    <div className="hidden">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4">
                            <Milk size={24} />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">{t('signup_title')}</h1>
                    <p className="text-slate-500 mt-2 text-sm">{t('signup_subtitle')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('phone_number')}</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setPhoneNumber(val);
                            }}
                            className="input-field font-mono tracking-widest"
                            placeholder="9876543210"
                            maxLength="12"
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

                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('confirm_password')}</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || phoneNumber.length < 10 || password !== confirmPassword}
                        className="w-full btn btn-primary py-3 mt-4 flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t('creating_account')}
                            </>
                        ) : t('signup_btn')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    {t('have_account')} {' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        {t('login_btn')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
