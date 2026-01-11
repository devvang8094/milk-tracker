import { Menu, Moon, Sun, Type } from 'lucide-react';
import { useFontSize } from '../context/FontSizeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header({ onMenuClick }) {
  const { size, setSize } = useFontSize();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h2 className="text-lg font-bold text-slate-800">
            Milk Book
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Font Size Toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setSize('small')}
            className={`p-1.5 rounded-md text-xs transition-all ${size === 'small' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Type size={12} />
          </button>
          <button
            onClick={() => setSize('normal')}
            className={`p-1.5 rounded-md text-sm transition-all ${size === 'normal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Type size={16} />
          </button>
          <button
            onClick={() => setSize('large')}
            className={`p-1.5 rounded-md text-base transition-all ${size === 'large' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Type size={20} />
          </button>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {lang === 'en' ? t('hindi') : t('english')}
        </button>
      </div>
    </header>
  );
}
