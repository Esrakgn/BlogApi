import { useState } from 'react';
import { LayoutDashboard, LogIn, LogOut, Search, UserCircle, Zap } from 'lucide-react';

function canManagePosts(user) {
  const role = user?.Role || user?.role;
  return role === 'Admin' || role === 'Writer' || role === 'Author';
}

const Navbar = ({ language, onLogout, onPanelClick, setBlogSearch, setLanguage, setPage, t, user }) => {
  const [searchText, setSearchText] = useState('');

  function handleSearch(event) {
    event.preventDefault();

    const value = searchText.trim();

    if (!value) {
      return;
    }

    setBlogSearch?.(value);
    setPage('read');
  }

  return (
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
          <button onClick={() => setPage('read')} className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">
            Oku
          </button>
          <button onClick={() => setPage('pricing')} className="hover:text-[#db2777] transition-colors border-b border-transparent hover:border-[#db2777]">
            {t.pricing}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <form onSubmit={handleSearch} className="hidden sm:flex items-center border-2 border-black bg-white">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="ARA"
            className="w-24 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest outline-none placeholder:text-black/30 focus:w-40 transition-all"
          />
          <button type="submit" className="border-l-2 border-black px-3 py-2 hover:bg-[#fef08a]" aria-label="Ara">
            <Search size={16} />
          </button>
        </form>
        <div className="flex border-2 border-black bg-white text-[10px] font-mono font-black uppercase">
          <button onClick={() => setLanguage('tr')} className={`px-3 py-2 ${language === 'tr' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
            TR
          </button>
          <button onClick={() => setLanguage('en')} className={`px-3 py-2 border-l-2 border-black ${language === 'en' ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
            EN
          </button>
        </div>
        {user ? (
          <>
            <button
              onClick={() => setPage('profile')}
              className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              <UserCircle size={14} /> Profilim
            </button>
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
};

export default Navbar;
