import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <nav className="glass pointer-events-auto h-16 px-6 rounded-full flex items-center gap-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center justify-center gap-1 w-12 group transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          <span className="material-symbols-outlined text-[26px] font-medium group-hover:scale-110 transition-transform">home</span>
          <span className={`w-1 h-1 rounded-full ${location.pathname === '/' ? 'bg-primary' : 'bg-transparent'}`} />
        </button>
        <button onClick={() => navigate('/stats')} className={`flex flex-col items-center justify-center gap-1 w-12 group transition-colors ${location.pathname === '/stats' ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">bar_chart</span>
          <span className={`w-1 h-1 rounded-full ${location.pathname === '/stats' ? 'bg-primary' : 'bg-transparent'}`} />
        </button>
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center justify-center gap-1 w-12 group transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">person</span>
          <span className={`w-1 h-1 rounded-full ${location.pathname === '/profile' ? 'bg-primary' : 'bg-transparent'}`} />
        </button>
      </nav>
    </div>
  );
}
