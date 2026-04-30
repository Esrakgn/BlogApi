import { LayoutDashboard, LogIn, LogOut, Search, Zap } from 'lucide-react';

function canManagePosts(user) {
  const role = user?.Role || user?.role;
  return role === 'Admin' || role === 'Writer' || role === 'Author';
}

const Navbar = ({ language, onLogout, onPanelClick, setLanguage, setPage, t, user }) => (
  <nav className="sticky top-0 z-50 bg-[#fdfcf8]/90 border-b-2 border-black/10 backdrop-blur-md px-8 py-5">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
      <div className="flex items-center gap-12">
        <h1
          onClick={() => setPage('home')}
          className="text-3xl font-serif italic font-black tracking-tighter flex items-center gap-2 cursor-pointer group"
        >
          <Zap size={28} className="fill-black group-hover:fill-[#db2777] transition-colors" /> THE RELAY
        </h1>

        <div className="hidden lg:flex gap-8 text-[10px] font-mono font-bold uppercase tracking-widest text-black/60">
          <button onClick={() => setPage('blog')} className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">
            {t.research}
          </button>
          <button onClick={() => setPage('pricing')} className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">
            {t.pricing}
          </button>
          <button className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">{t.hardware}</button>
          <button className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">{t.future}</button>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Search size={20} className="hidden sm:block text-black cursor-pointer" />
        <div className="flex border-2 border-black bg-white text-[10px] font-mono font-black uppercase">
          <button onClick={() => setLanguage('tr')} className={`px-3 py-2 ${language === 'tr' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
            TR
          </button>
          <button onClick={() => setLanguage('en')} className={`px-3 py-2 border-l-2 border-black ${language === 'en' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
            EN
          </button>
        </div>
        <button
          onClick={() => setPage('pricing')}
          className="bg-black text-white px-5 md:px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-[#db2777] transition-all transform active:translate-y-1"
        >
          {t.subscribe}
        </button>
        {user ? (
          <>
            {canManagePosts(user) && (
              <button
                onClick={onPanelClick}
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                <LayoutDashboard size={14} /> {t.panel}
              </button>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              <LogOut size={14} /> {t.logout}
            </button>
          </>
        ) : (
          <button
            onClick={() => setPage('auth')}
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            <LogIn size={14} /> {t.login}
          </button>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;
