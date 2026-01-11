import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addExpense, getExpenses, getDashboardStats, updateExpense, deleteExpense } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Receipt, History, Edit2, Trash2, XCircle, Save, IndianRupee, Calendar, FileText } from 'lucide-react';

function AddExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
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
      const [eData, dData] = await Promise.all([
        getExpenses(),
        getDashboardStats()
      ]);

      if (eData.success) {
        setHistory(eData.expenses);
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

    // Check balance removed (Negative allowed)

    try {
      if (editingId) {
        await updateExpense(editingId, { amount: val, description, date });
        setEditingId(null);
      } else {
        await addExpense({ amount: val, description, date });
      }

      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    const d = new Date(item.date);
    setDate(d.toISOString().split('T')[0]);
    setAmount(item.amount);
    setDescription(item.description);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        loadData();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Expense' : t('add_expense_title')}</h1>
        <p className="text-slate-500">{t('add_expense_subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* EXPENSE FORM */}
        <div className="card p-6 h-fit border-l-4 border-l-red-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <Receipt size={24} />
            </div>
            <h2 className="text-lg font-semibold">{editingId ? 'Update Details' : 'New Expense'}</h2>
          </div>

          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 text-sm font-medium">{t('available_balance')}</p>
            <p className="text-2xl font-bold text-red-900">₹ {availableBalance.toLocaleString()}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('amount')}</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10"
                  placeholder="500"
                  required
                />
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('description')}</label>
              <div className="relative">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field pl-10"
                  placeholder="e.g. Cattle Feed"
                  required
                />
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('date')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field pl-10"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
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
              <button type="submit" disabled={loading} className="w-full btn bg-red-600 hover:bg-red-700 text-white py-3 flex items-center justify-center gap-2">
                <Save size={18} /> {loading ? t('saving') : (editingId ? 'Update Expense' : t('save_expense'))}
              </button>
            </div>
          </form>
        </div>

        {/* HISTORY LIST */}
        <div className="card p-0 overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-700">Recent Expenses</h3>
          </div>

          <div className="overflow-y-auto p-0 flex-1">
            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No expenses recorded</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                  <tr>
                    <th className="px-4 py-3">{t('date')}</th>
                    <th className="px-4 py-3">{t('description')}</th>
                    <th className="px-4 py-3 text-right">{t('amount')}</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 group">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium whitespace-normal max-w-[150px]">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-red-600 whitespace-nowrap">
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

export default AddExpense;
