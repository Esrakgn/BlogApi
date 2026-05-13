import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { getPosts } from '../services/postService';
import { getCategories } from '../services/categoryService';
import { getPostItems, mapPostToArticle } from '../utils/postMapper';

const realityTabs = ['EXPRESSIVE', 'EMPATHETIC', 'ACTIONABLE', 'PERSONALIZED'];

const BlogPage = ({ onPostSelect, searchQuery = '', setBlogSearch, setPage, setPricingPlanType, t }) => {
  const [activeTab, setActiveTab] = useState('EXPRESSIVE');
  const [apiPosts, setApiPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pageNumber, setPageNumber] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const activeContent = t.blog.tabs[activeTab];
  const researchCards = postsError ? t.researchPapers : apiPosts;

  useEffect(() => {
    async function loadPosts() {
      try {
        setPostsLoading(true);
        setPostsError(null);

        const response = await getPosts({
          pageNumber,
          pageSize: 6,
          sortBy,
          categoryId: selectedCategoryId || undefined,
          search: searchQuery || undefined,
        });
        const posts = getPostItems(response);

        setApiPosts(posts.map((post, index) => mapPostToArticle(post, index)));
        setPagination({
          totalCount: response?.totalCount || posts.length,
          totalPages: response?.totalPages || 1,
        });
      } catch (error) {
        setPostsError(error.message);
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  }, [pageNumber, searchQuery, selectedCategoryId, sortBy]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery]);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesError(null);
        const response = await getCategories();
        setCategories(Array.isArray(response) ? response : response?.items || []);
      } catch (error) {
        setCategoriesError(error.message);
      }
    }

    loadCategories();
  }, []);

  function handleCategoryChange(categoryId) {
    setSelectedCategoryId(categoryId);
    setPageNumber(1);
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
    setPageNumber(1);
  }

  function clearSearch() {
    setBlogSearch?.('');
    setPageNumber(1);
  }

  return (
    <div className="bg-[#fdfcf8] min-h-screen">
      <section className="pt-24 pb-16 px-8 text-center bg-[#fdfcf8]">
        <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-black/40 mb-4">{t.blog.kicker}</h5>
        <h2 className="text-6xl md:text-8xl font-serif italic font-black text-black mb-6">{t.blog.title}</h2>
        <p className="text-xl text-black/60 font-medium">{t.blog.subtitle}</p>
      </section>

      <section className="grid lg:grid-cols-2 border-y-2 border-black overflow-hidden">
        <div className="p-12 lg:p-24 flex flex-col justify-center space-y-8 bg-white border-r-2 border-black text-left">
          <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#db2777]">{t.blog.approachKicker}</h5>
          <h3 className="text-5xl font-serif italic font-bold leading-tight">{t.blog.approachTitle}</h3>
          <p className="text-lg text-black/60 leading-relaxed">{t.blog.approachText}</p>
        </div>
        <div className="bg-[#e2e8f0] relative min-h-[400px] flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
          <RetroWindow title="THE DANCE" className="w-full max-w-md relative z-10">
            <div className="aspect-square bg-white border border-black overflow-hidden p-3">
              <img src="/images/ui/danss.png" alt="THE DANCE" className="h-full w-full object-contain" />
            </div>
          </RetroWindow>
        </div>
      </section>

      <section className="py-24 px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-serif italic font-black mb-6 uppercase">{t.blog.researchTitle}</h2>
          <p className="text-black/60 max-w-xl mx-auto italic font-serif">{t.blog.researchText}</p>
        </div>

        <div className="max-w-5xl mx-auto relative min-h-[600px] flex items-center justify-center">
          <div className="w-full max-w-2xl relative z-10">
            <RetroWindow title="CLI TERMINAL" color="bg-[#475569]">
              <div className="bg-[#1e293b] p-6 font-mono text-[11px] text-[#a7f3d0] space-y-1 text-left">
                <p>{'>'} initializing relay-lab-kernel...</p>
                <p>{'>'} {t.blog.terminal.loading}</p>
                <p className="text-white">{'>'} {t.blog.terminal.status}</p>
                <br />
                <p className="text-pink-400">bash-3.2$ whoami</p>
                <p>relay-research-node-v2.1</p>
                <p className="text-pink-400">bash-3.2$ run research --mode="humanlike"</p>
                <p>{'>'} {t.blog.terminal.active}</p>
                <p className="text-yellow-400">{'>'} {t.blog.terminal.emotions}</p>
                <div className="mt-4 h-12 w-1 bg-white animate-pulse" />
              </div>
            </RetroWindow>
          </div>

          <div className="absolute top-0 left-0 w-52 rotate-[-3deg] hidden md:block text-left">
            <RetroWindow title="KOD_NOTLARI" color="bg-[#bfdbfe]">
              <p className="text-[10px] font-mono font-bold leading-tight uppercase">{t.blog.areas[0]}</p>
            </RetroWindow>
          </div>
          <div className="absolute top-10 right-0 w-52 rotate-[5deg] hidden md:block text-left">
            <RetroWindow title="AI_GÜNDEMİ" color="bg-[#a7f3d0]">
              <p className="text-[10px] font-mono font-bold leading-tight uppercase">{t.blog.areas[1]}</p>
            </RetroWindow>
          </div>
          <div className="absolute bottom-10 left-10 w-52 rotate-[2deg] hidden md:block text-left">
            <RetroWindow title="WEB_API" color="bg-[#fef08a]">
              <p className="text-[10px] font-mono font-bold leading-tight uppercase">{t.blog.areas[2]}</p>
            </RetroWindow>
          </div>
          <div className="absolute bottom-0 right-10 w-52 rotate-[-4deg] hidden md:block text-left">
            <RetroWindow title="TOPLULUK" color="bg-[#f472b6]">
              <p className="text-[10px] font-mono font-bold leading-tight uppercase">{t.blog.areas[3]}</p>
            </RetroWindow>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-[#fdfcf8] border-t-2 border-black">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-serif italic font-bold">{t.blog.cardsTitle}</h2>
        </div>
        <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-4 border-2 border-black bg-white p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange('')}
              className={`border-2 border-black px-4 py-2 font-mono text-[9px] font-black uppercase tracking-widest transition-colors ${
                selectedCategoryId === '' ? 'bg-black text-white' : 'bg-[#fdfcf8] hover:bg-[#fef08a]'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category.id || category.Id}
                type="button"
                onClick={() => handleCategoryChange(category.id || category.Id)}
                className={`border-2 border-black px-4 py-2 font-mono text-[9px] font-black uppercase tracking-widest transition-colors ${
                  selectedCategoryId === (category.id || category.Id) ? 'bg-black text-white' : 'bg-[#fdfcf8] hover:bg-[#fef08a]'
                }`}
              >
                {category.name || category.Name}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 font-mono text-[9px] font-black uppercase tracking-widest text-black/50">
            Sıralama
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border-2 border-black bg-[#fdfcf8] px-3 py-2 text-black outline-none focus:bg-[#fef08a]"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
            </select>
          </label>
        </div>
        {searchQuery && (
          <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-3 border-2 border-black bg-[#fef08a] px-5 py-4 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center sm:justify-between">
            <span>Arama sonucu: {searchQuery}</span>
            <button type="button" onClick={clearSearch} className="self-start border-2 border-black bg-white px-3 py-2 hover:bg-black hover:text-white sm:self-auto">
              Temizle
            </button>
          </div>
        )}
        {postsLoading && (
          <div className="mb-8 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Yazılar yükleniyor...
          </div>
        )}
        {postsError && (
          <div className="mb-8 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#db2777]">
            Backend yazıları alınamadı. Varsayılan kartlar gösteriliyor.
          </div>
        )}
        {categoriesError && (
          <div className="mb-8 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#db2777]">
            Kategoriler alınamadı.
          </div>
        )}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {researchCards.map((paper) => (
            <div
              key={paper.id || paper.title}
              onClick={() => paper.id && onPostSelect(paper.id)}
              className={`${paper.color || paper.windowColor} border-2 border-black p-8 flex flex-col justify-between min-h-[380px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-transform cursor-pointer text-left group`}
            >
              <div>
                {paper.image && (
                  <div className="mb-6 overflow-hidden border-2 border-black bg-white p-3">
                    <img src={paper.image} alt={paper.title} className="h-40 w-full object-contain" />
                  </div>
                )}
                <span className="text-[9px] font-mono font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-8 inline-block">{paper.tag || paper.category}</span>
                <h4 className="text-3xl font-serif italic font-bold leading-tight mt-4 group-hover:text-[#db2777] transition-colors">{paper.title}</h4>
              </div>
              <div className="flex justify-between items-end border-t-2 border-black/10 pt-6">
                <div className="text-[10px] font-mono font-black uppercase">{paper.author || paper.category}</div>
                <div className="text-[10px] font-mono text-black/40">{paper.date}</div>
              </div>
            </div>
          ))}
        </div>
        {!postsLoading && apiPosts.length === 0 && !postsError && (
          <div className="mx-auto mt-10 max-w-7xl border-2 border-black bg-white p-6 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Bu filtreye uygun yazı bulunamadı.
          </div>
        )}
        {!postsError && pagination.totalPages > 1 && (
          <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
              disabled={pageNumber <= 1 || postsLoading}
              className="border-2 border-black bg-white px-5 py-3 font-mono text-[9px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Önceki
            </button>
            <span className="border-2 border-black bg-[#fef08a] px-4 py-3 font-mono text-[9px] font-black uppercase tracking-widest">
              {pageNumber} / {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.min(pagination.totalPages, current + 1))}
              disabled={pageNumber >= pagination.totalPages || postsLoading}
              className="border-2 border-black bg-white px-5 py-3 font-mono text-[9px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        )}
        <div className="text-center mt-20">
          <button
            type="button"
            onClick={() => {
              setBlogSearch?.('');
              setPage?.('read');
            }}
            className="bg-black text-white px-12 py-4 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(219,39,119,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            {t.blog.seeAll}
          </button>
        </div>
      </section>

      <section className="py-24 px-8 bg-white border-y-2 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif italic font-black uppercase mb-4">{t.blog.realityTitle}</h2>
            <p className="text-black/60 italic font-serif">{t.blog.realityText}</p>
          </div>

          <div className="max-w-5xl mx-auto border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex border-b-2 border-black overflow-x-auto bg-gray-50">
              {realityTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[120px] py-5 text-[10px] font-mono font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-black text-white' : 'bg-white hover:bg-black/5 text-black'}`}
                >
                  {t.blog.tabs.labels[tab]}
                </button>
              ))}
            </div>
            <div className="p-8 md:p-16 grid lg:grid-cols-2 gap-16 items-center bg-white">
              <div className="space-y-8 text-left">
                <h3 className="text-5xl font-serif italic font-bold leading-tight">{activeContent.title}</h3>
                <p className="text-xl text-black/60 leading-relaxed italic">{activeContent.text}</p>
                <button className="bg-[#db2777] text-white px-10 py-4 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-colors">
                  {t.blog.tabs.labels[activeTab]}
                </button>
              </div>
              <div className="bg-black p-2 border-2 border-black shadow-[8px_8px_0px_0px_rgba(219,39,119,1)]">
                <div className="aspect-[16/10] overflow-hidden bg-white">
                  <img src={activeContent.image || '/images/ui/tavus.png'} alt={activeContent.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 bg-[#fdfcf8]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center text-left">
          <div className="space-y-10">
            <h3 className="text-6xl font-serif italic font-black uppercase leading-[0.95] text-black">{t.blog.joinTitle}</h3>
            <p className="text-xl text-black/60 font-medium leading-relaxed">{t.blog.joinText}</p>
            <button
              onClick={() => {
                setPricingPlanType?.('Writer');
                setPage?.('pricing');
              }}
              className="bg-[#db2777] text-white px-12 py-5 text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              {t.blog.careers}
            </button>
          </div>
          <div className="relative">
            <RetroWindow title="OFFICE_VIEW // TERMINAL" color="bg-[#a7f3d0]" className="w-full">
              <div className="aspect-video bg-[#0f172a] border-2 border-black flex flex-col items-start p-6 overflow-hidden">
                <div className="flex gap-2 mb-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                </div>
                <Users size={80} className="text-[#a7f3d0] opacity-20 self-center my-4" />
                <p className="font-mono text-[10px] text-green-400">{'>'} {t.blog.hiring[0]}</p>
                <p className="font-mono text-[10px] text-green-400">{'>'} {t.blog.hiring[1]}</p>
                <p className="font-mono text-[10px] text-white animate-pulse">{'>'} {t.blog.hiring[2]}</p>
              </div>
            </RetroWindow>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
