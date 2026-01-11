import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    MinusCircle,
    Wallet,
    User,
    LogOut,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const menuItems = [
        {
            label: t('dashboard'),
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            label: t('add_milk'),
            path: '/add-milk',
            icon: PlusCircle
        },
        {
            label: t('add_expense'),
            path: '/add-expense',
            icon: MinusCircle
        },
        {
            label: t('withdraw'),
            path: '/withdraw',
            icon: Wallet
        },
        {
            label: t('profile'),
            path: '/profile',
            icon: User
        },
    ];

    return (
        <div className={clsx(
            "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span>{t('app_name')}</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setIsOpen(false);
                            }}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                >
                    <LogOut size={20} />
                    {t('logout')}
                </button>
            </div>
        </div>
    );
}
