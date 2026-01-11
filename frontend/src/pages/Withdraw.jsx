import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addWithdrawal, getWithdrawals, getDashboardStats, updateWithdrawal, deleteWithdrawal } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Wallet, History, ArrowDownLeft, Edit2, Trash2, XCircle, Save } from 'lucide-react';

function Withdraw() {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [availableBalance, setAvailableBalance] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const { t } = useLanguage();

    const location = useLocation();

    // Fetch history and balance
    useEffect(() => {
        loadData();
        if (location.state?.record && location.state?.editMode) {
            handleEdit(location.state.record);
        }
    }, []);

    const loadData = async () => {
        try {
            const [wData, dData] = await Promise.all([
                getWithdrawals(),
                getDashboardStats()
            ]);

            if (wData.success) {
                setHistory(wData.withdrawals);
            }
            if (dData.success) {
                setAvailableBalance(dData.availableBalance);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const val = parseFloat(amount);

        if (val <= 0) {
            setError('Amount must be greater than 0');
            setLoading(false);
            return;
        }

        // Logic for balance check removed (Negative allowed)

        try {
            if (editingId) {
                await updateWithdrawal(editingId, { amount: val, date });
                setEditingId(null);
            } else {
                await addWithdrawal({ amount: val, date });
            }

            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            loadData(); // Refresh history and balance
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        // format date
        const d = new Date(item.date);
        setDate(d.toISOString().split('T')[0]);
        setAmount(item.amount);
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this withdrawal?')) {
            try {
                await deleteWithdrawal(id);
                loadData();
            } catch (e) {
                alert(e.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Withdrawal' : t('withdraw_title')}</h1>
                <p className="text-slate-500">{t('withdraw_subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* WITHDRAW FORM */}
                <div className="card p-6 h-fit border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <h2 className="text-lg font-semibold">{editingId ? 'Update Details' : t('new_withdrawal')}</h2>
                    </div>

                    <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-purple-600 text-sm font-medium">{t('available_balance')}</p>
                        <p className="text-2xl font-bold text-purple-900">₹ {availableBalance.toLocaleString()}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('amount')}</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input-field text-lg font-semibold"
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('date')}</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 btn btn-secondary py-3 flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18} /> Cancel
                                </button>
                            )}
                            <button type="submit" disabled={loading} className="w-full btn bg-purple-600 hover:bg-purple-700 text-white py-3 flex items-center justify-center gap-2">
                                <Save size={18} /> {loading ? t('saving') : (editingId ? 'Update Withdrawal' : t('save_withdrawal'))}
                            </button>
                        </div>
                    </form>
                </div>

                {/* HISTORY LIST */}
                <div className="card p-0 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <History size={18} className="text-slate-500" />
                        <h3 className="font-semibold text-slate-700">{t('recent_withdrawals')}</h3>
                    </div>

                    <div className="overflow-y-auto p-0 flex-1">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">{t('no_withdrawals')}</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">{t('date')}</th>
                                        <th className="px-4 py-3 text-right">{t('amount')}</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 group">
                                            <td className="px-4 py-3 text-slate-600">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-purple-600">
                                                - ₹{item.amount}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Withdraw;
