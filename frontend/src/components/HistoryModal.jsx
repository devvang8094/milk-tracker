import React from 'react';
import { X, Calendar, DollarSign, Droplet, Percent } from 'lucide-react';
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
                            <div className="animate-pulse">Loading history...</div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                            <Calendar size={48} className="opacity-20" />
                            <p>No records found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <HistoryItem key={item.id || index} item={item} type={type} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function HistoryItem({ item, type }) {
    const date = new Date(item.date).toLocaleDateString();

    if (type === 'balance') {
        const isCredit = item.type === 'credit';
        const colorClass = isCredit ? 'text-green-600' : 'text-red-600';
        const bgClass = isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
        const Icon = isCredit ? Droplet : DollarSign; // Droplet for milk, Dollar for money out

        return (
            <div className={`p-3 bg-white border rounded-xl shadow-sm flex items-center justify-between ${isCredit ? 'border-green-100' : 'border-red-100'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bgClass}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <p className="text-xs text-slate-500 capitalize">
                            {item.source === 'milk' ? `${item.description} Milk` : item.description || item.source}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`font-bold ${colorClass}`}>
                        {isCredit ? '+' : '-'} ₹{parseFloat(item.amount).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.type}</p>
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
                        <p className="text-xs text-slate-500">Rate Record</p>
                    </div>
                </div>
                <p className="font-bold text-slate-900">₹{item.rate}/fat</p>
            </div>
        );
    }

    if (type === 'earnings') {
        return (
            <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.session === 'morning' ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <Droplet size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{date}</p>
                        <div className="text-xs text-slate-500 flex gap-2">
                            <span className="capitalize">{item.session}</span>
                            <span>•</span>
                            <span>{item.litres} L</span>
                            <span>•</span>
                            <span>{item.fat_percentage}% Fat</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-slate-900">₹{item.amount}</p>
                    <p className="text-xs text-slate-400">@{item.rate_per_fat}/fat</p>
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
                <p className="font-bold text-red-600">- ₹{item.amount}</p>
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
                        <p className="text-xs text-slate-400">Withdrawal</p>
                    </div>
                </div>
                <p className="font-bold text-purple-600">- ₹{item.amount}</p>
            </div>
        );
    }

    return null;
}
