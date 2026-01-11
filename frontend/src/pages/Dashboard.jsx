import { useEffect, useState } from 'react';
import { getDashboardStats, getFatPrice, updateFatPrice } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Wallet, Edit2, Check, X, Percent } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEarning: 0,
    totalExpenses: 0,
    totalWithdrawn: 0,
    availableBalance: 0
  });

  // Fat Rate State
  const [ratePerFat, setRatePerFat] = useState(0);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState('');
  const [rateLoading, setRateLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, rateData] = await Promise.all([
        getDashboardStats(),
        getFatPrice()
      ]);

      if (statsData.success) setStats(statsData);
      if (rateData.success) {
        const r = parseFloat(rateData.ratePerFat || 0);
        setRatePerFat(r);
        setTempRate(r);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveRate = async () => {
    const val = parseFloat(tempRate);
    if (isNaN(val) || val <= 0) {
      alert('Rate must be greater than 0');
      return;
    }
    setRateLoading(true);
    try {
      await updateFatPrice(val);
      setRatePerFat(val);
      setIsEditingRate(false);
    } catch (e) {
      alert('Failed to update rate: ' + e.message);
    } finally {
      setRateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard')}</h1>
          <p className="text-slate-500">{t('dashboard_subtitle')}</p>
        </div>
        <button onClick={loadData} className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
          {t('refresh')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

        {/* FAT RATE CARD (NEW) */}
        <div className="card p-5 border-2 border-dashed border-blue-200 bg-blue-50/50">
          <div className="flex items-start justify-between mb-2">
            <p className="text-blue-800 text-sm font-bold">Rate per 1 Fat</p>
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <Percent size={18} />
            </div>
          </div>

          {isEditingRate ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                step="0.1"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                className="w-full px-2 py-1 text-slate-900 text-lg font-bold rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button onClick={handleSaveRate} disabled={rateLoading} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200">
                <Check size={18} />
              </button>
              <button onClick={() => { setIsEditingRate(false); setTempRate(ratePerFat); }} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-900">₹ {ratePerFat}</h3>
              <button onClick={() => setIsEditingRate(true)} className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg transition-colors" title="Edit Rate">
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* BALANCE */}
        <div className={`card p-5 text-white border-none shadow-lg xl:col-span-1 ${stats.availableBalance < 0
          ? 'bg-gradient-to-br from-red-600 to-orange-700 shadow-red-900/20'
          : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-900/20'
          }`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{t('available_balance')}</p>
              <h3 className="text-3xl font-bold">₹ {stats.availableBalance.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="text-white" size={24} />
            </div>
          </div>
          {stats.availableBalance < 0 && (
            <div className="mt-3 bg-black/20 text-white text-xs px-2 py-1 rounded inline-block font-bold">
              {t('overdraft_warning').replace('{amount}', Math.abs(stats.availableBalance).toLocaleString())}
            </div>
          )}
        </div>

        {/* EARNINGS */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{t('total_earnings')}</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">₹ {stats.totalEarning.toLocaleString()}</h3>
        </div>

        {/* EXPENSES */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{t('total_expenses')}</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">₹ {stats.totalExpenses.toLocaleString()}</h3>
        </div>

        {/* WITHDRAWN */}
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <ArrowDownLeft size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{t('total_withdrawn')}</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">₹ {stats.totalWithdrawn.toLocaleString()}</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-slate-800 mt-2">{t('quick_actions')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/add-milk', { state: { session: 'morning' } })}
          className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl transition-all group"
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">☀️</span>
          <span className="font-semibold text-yellow-800">{t('morning_milk')}</span>
        </button>

        <button
          onClick={() => navigate('/add-milk', { state: { session: 'night' } })}
          className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all group"
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌙</span>
          <span className="font-semibold text-indigo-800">{t('night_milk')}</span>
        </button>

        <button
          onClick={() => navigate('/add-expense')}
          className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all group"
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧾</span>
          <span className="font-semibold text-red-800">{t('add_expense')}</span>
        </button>

        <button
          onClick={() => navigate('/withdraw')}
          className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all group"
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💸</span>
          <span className="font-semibold text-purple-800">{t('withdraw')}</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
