```
import React from 'react';
import { X, Calendar, Droplet, DollarSign, Percent, ArrowUpRight, ArrowDownLeft, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HistoryModal({ isOpen, onClose, title, data, type, loading }) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    // Safety check
    const items = Array.isArray(data) ? data : [];

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full md:w-[600px] h-[80vh] md:h-[600px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-slate-50 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-slate-400">
                            <div className="animate-pulse">{t('loading') || 'Loading...'}</div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                            <Calendar size={48} className="opacity-20" />
                            <p>{t('no_records_found')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <HistoryItem 
                                    key={item.id || index} 
                                    item={item} 
                                    type={type} 
                                    onEdit={onEdit} 
                                    onDelete={onDelete} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HistoryItem({ item, type, onEdit, onDelete }) {
    const { t } = useLanguage();
    const date = new Date(item.date).toLocaleDateString();

    const ActionButtons = () => (
        <div className="flex gap-2 ml-4">
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <Edit2 size={16} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item); }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );

    if (type === 'balance') {
        const isCredit = item.type === 'credit';
        // Ensure color classes are secure
        const colorClass = isCredit ? 'text-green-600' : 'text-red-600';
        const bgClass = isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
        const Icon = isCredit ? Droplet : DollarSign;

        // Description Translation Logic
        let displayDesc = item.description;
        if (item.source === 'milk') {
            // item.description is 'morning' or 'night'
            displayDesc = item.description === 'morning' ? t('morning_milk') : t('night_milk');
        } else if (item.source === 'withdrawal') {
            displayDesc = t('withdrawal');
        } else if (item.source === 'expense') {
            displayDesc = item.description; // User typed description, keep as is
        }

        return (
            <div className={`p - 3 bg - white border rounded - xl shadow - sm flex items - center justify - between ${ isCredit ? 'border-green-100' : 'border-red-100' } `}>
                <div className="flex items-center gap-3">
                    <div className={`p - 2 rounded - lg ${ bgClass } `}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-500 capitalize">
                           {displayDesc}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-right">
                        <p className={`font - bold ${ colorClass } `}>
                            {isCredit ? '+' : '-'} ₹{parseFloat(item.amount).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {item.type === 'credit' ? t('credit') : t('debit')}
                        </p>
                    </div>
                    <ActionButtons />
                </div>
            </div>
        );
    }

    if (type === 'rate') {
        return (
            <div className="p-3 bg-white border border-blue-50 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                       <Percent size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-500">{t('fat_price_label')}</p>
                    </div>
                </div>
                {/* Rate history is usually read-only or handled via config, but we can allow delete if needed. 
                    However, rate items in history might not be delete-able if they are just logs.
                    Assuming rate history endpoint returns items with IDs. 
                    Our backend /history/rate just returns log. 
                    Actually, it selects Distinct logs. 
                    User: "Milk records, Expenses, Withdrawals" -> these are the ones to unlock.
                    Rate is separate. Skip actions for Rate. */}
                <p className="font-bold text-slate-900">₹{item.rate}/fat</p>
            </div>
        );
    }

    if (type === 'earnings') {
        return (
            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p - 2 rounded - lg ${ item.session === 'morning' ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600' } `}>
                        <Droplet size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <div className="text-xs text-slate-500 flex gap-2">
                            <span className="capitalize">{item.session === 'morning' ? t('morning_milk') : t('night_milk')}</span>
                            <span>•</span>
                            <span>{item.litres} L</span>
                            <span>•</span>
                            <span>{item.fat_percentage}% {t('fat_price_label') ? 'Fat' : 'Fat'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-right">
                        <p className="font-bold text-slate-900">₹{item.amount}</p>
                        <p className="text-xs text-slate-400">@{item.rate_per_fat}/fat</p>
                    </div>
                    <ActionButtons />
                </div>
            </div>
        );
    }

    if (type === 'expenses') {
        return (
            <div className="p-3 bg-white border border-red-50 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                        <DollarSign size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="font-bold text-red-600">- ₹{item.amount}</p>
                    <ActionButtons />
                </div>
            </div>
        );
    }

    if (type === 'withdrawals') {
        return (
            <div className="p-3 bg-white border border-purple-50 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                        <DollarSign size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-400">{t('withdrawal')}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="font-bold text-purple-600">- ₹{item.amount}</p>
                    <ActionButtons />
                </div>
            </div>
        );
    }

    return null;
}
```
