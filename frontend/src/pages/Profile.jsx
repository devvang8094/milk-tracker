import { useState, useEffect } from 'react';
import { getFatPrice, updateFatPrice } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Save, User, IndianRupee } from 'lucide-react';

function Profile() {
    const [ratePerFat, setRatePerFat] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const { t } = useLanguage();
    // Use phone number or user as identifier
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const identifier = user.phoneNumber || user.username || 'User';

    useEffect(() => {
        loadFatRate();
    }, []);

    const loadFatRate = async () => {
        try {
            const data = await getFatPrice();
            if (data.success) {
                // If it's a number 0, show simplified
                setRatePerFat(data.ratePerFat);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const rate = parseFloat(ratePerFat);
        if (rate <= 0) {
            setErr('Rate must be greater than 0');
            return;
        }

        setLoading(true);
        setMsg('');
        setErr('');

        try {
            await updateFatPrice(rate);
            setMsg('Fat rate updated successfully!');
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{t('profile_title')}</h1>
                <p className="text-slate-500">{t('profile_subtitle')}</p>
            </div>

            <div className="card p-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{identifier}</h2>
                        <p className="text-slate-500 text-sm">{t('member_label')}</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">{t('fat_rate_config')}</h3>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rate per 1 Fat (₹)</label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={ratePerFat}
                                    onChange={(e) => setRatePerFat(e.target.value)}
                                    className="input-field pl-10 text-lg font-bold"
                                    placeholder="e.g. 9.0"
                                    required
                                    min="0"
                                />
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                New Rate will be applied to all future Milk Records. Calculation: Litres × Fat × Rate.
                            </p>
                        </div>

                        {msg && <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm">{msg}</div>}
                        {err && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{err}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={18} />
                            {loading ? t('saving') : t('save_changes')}
                        </button>
                    </form>
                </div>

                {/* DANGER ZONE */}
                <div className="mt-8 pt-8 border-t border-red-100">
                    <h3 className="font-bold text-red-600 mb-2">{t('danger_zone') || 'Danger Zone'}</h3>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-red-900">{t('delete_account_title') || 'Delete Account'}</h4>
                            <p className="text-sm text-red-700">{t('delete_account_desc') || 'Permanently remove your account and all data. This cannot be undone.'}</p>
                        </div>
                        <button
                            onClick={async () => {
                                if (window.confirm(t('delete_confirm_msg') || 'Are you definitely sure? This action is irreversible.')) {
                                    try {
                                        setLoading(true);
                                        const { deleteUserAccount } = await import('../services/api');
                                        await deleteUserAccount();
                                        localStorage.clear();
                                        window.location.href = '/login';
                                    } catch (err) {
                                        alert('Failed to delete: ' + err.message);
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="btn bg-white text-red-600 border border-red-200 hover:bg-red-50 whitespace-nowrap"
                        >
                            {t('delete_account_btn') || 'Delete Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
