import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addMilkRecord, getMilkRecords, updateMilkRecord, deleteMilkRecord, getFatPrice } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Droplets, Calendar, Save, Percent, Edit2, Trash2, XCircle } from 'lucide-react';

function AddMilk() {
  const location = useLocation();
  const { t } = useLanguage();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState(location.state?.session || 'morning');
  const [litres, setLitres] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Single Rate
  const [ratePerFat, setRatePerFat] = useState(0);

  // Edit State
  const [editingId, setEditingId] = useState(null);

  // List
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rateData, recData] = await Promise.all([
        getFatPrice(),
        getMilkRecords()
      ]);

      if (rateData.success) {
        setRatePerFat(parseFloat(rateData.ratePerFat || 0));
      }
      if (recData.success) {
        setRecentRecords(recData.records);
      }
    } catch {
      // silent fail
    }
  }

  // Auto-calculate amount for display
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    if (!litres || !fat) {
      setCalculatedAmount(0);
      return;
    }
    const l = parseFloat(litres);
    const f = parseFloat(fat);

    if (l <= 0 || f <= 0 || f > 10) {
      setCalculatedAmount(0);
      return;
    }

    setCalculatedAmount(Math.round(l * f * ratePerFat));
  }, [litres, fat, ratePerFat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const l = parseFloat(litres);
    const f = parseFloat(fat);

    if (l <= 0 || f <= 0) {
      setError('Litres and Fat must be greater than 0');
      setLoading(false);
      return;
    }

    if (f > 10) {
      setError('Fat must be between 0 and 10');
      setLoading(false);
      return;
    }

    // Check rate logic
    if (ratePerFat === 0) {
      // Warn logic or just proceed
    }

    const payload = {
      date,
      session,
      litres: l,
      fat_percentage: f
    };

    try {
      if (editingId) {
        await updateMilkRecord(editingId, payload);
        setEditingId(null);
      } else {
        await addMilkRecord(payload);
      }

      setLitres('');
      setFat('');
      // Refresh list
      const recData = await getMilkRecords();
      if (recData.success) setRecentRecords(recData.records);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    const d = new Date(record.date);
    setDate(d.toISOString().split('T')[0]);
    setSession(record.session);
    setLitres(record.litres);
    setFat(record.fat_percentage);
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setLitres('');
    setFat('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteMilkRecord(id);
        const recData = await getMilkRecords();
        if (recData.success) setRecentRecords(recData.records);
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* FORM */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Record' : t('add_milk_title')}</h1>
          <p className="text-slate-500">{t('add_milk_subtitle')}</p>
        </div>

        <div className="card p-6 border-l-4 border-l-blue-500">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center text-sm text-blue-800">
            <span>Current Rate: <strong>₹{ratePerFat}/fat</strong></span>
            {ratePerFat <= 0 && <span className="text-red-600 font-bold">⚠️ Rate is 0! Cannot Save. Go to Profile.</span>}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* SESSION TOGGLE */}
            <div className="bg-slate-100 p-1 rounded-xl flex">
              <button
                type="button"
                onClick={() => setSession('morning')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${session === 'morning' ? 'bg-white shadow text-yellow-600' : 'text-slate-500'}`}
              >
                ☀️ {t('morning')}
              </button>
              <button
                type="button"
                onClick={() => setSession('night')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${session === 'night' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
              >
                🌙 {t('night')}
              </button>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('litres')}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={litres}
                    onChange={(e) => setLitres(e.target.value)}
                    className="input-field pl-10"
                    placeholder="5.0"
                    required
                  />
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-700">{t('fat_percentage')}</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="input-field pl-10"
                    placeholder="6.5"
                    max="10"
                    required
                  />
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
              <span className="text-blue-700 font-medium">{t('estimated_amount')}</span>
              <span className="text-2xl font-bold text-blue-800">₹{calculatedAmount}</span>
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
              <button type="submit" disabled={loading || ratePerFat <= 0} className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2">
                <Save size={18} /> {loading ? t('saving') : (editingId ? 'Update Record' : t('save_record'))}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RECENT LIST */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 mt-2">{t('recent_records')}</h2>
        <div className="card overflow-hidden">
          {recentRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">{t('no_records')}</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {recentRecords.map((item, idx) => (
                <div key={item.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.session === 'morning' ? 'bg-yellow-100' : 'bg-indigo-100'}`}>
                      {item.session === 'morning' ? '☀️' : '🌙'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{new Date(item.date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">
                        {item.litres} L • {item.fat_percentage}% • ₹{item.rate_per_fat}/fat
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-slate-900">₹{parseFloat(item.amount).toFixed(0)}</p>
                    {item.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default AddMilk;
