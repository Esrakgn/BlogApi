import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard.jsx';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { getPosts } from '../services/postService';
import { getPostItems, mapPostToArticle } from '../utils/postMapper';

const HomePage = ({ onPostSelect, setPage, t }) => {
  const [apiArticles, setApiArticles] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        setPostsLoading(true);
        setPostsError(null);

        const response = await getPosts({ pageNumber: 1, pageSize: 4 });
        const posts = getPostItems(response);

        setApiArticles(posts.map((post, index) => mapPostToArticle(post, index)));
      } catch (error) {
        setPostsError(error.message);
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  }, []);

  const articles = apiArticles.length > 0 ? apiArticles : t.articles;

  return (
  <>
    <section className="relative pt-24 pb-32 px-8 overflow-hidden bg-[#fdfcf8]">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative text-left">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-3 bg-[#fef08a] border-2 border-black px-4 py-1.5 text-[9px] font-mono font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 bg-black animate-pulse" /> {t.home.status}
          </div>
          <h2 className="text-7xl md:text-9xl font-serif italic leading-[0.85] tracking-tight text-black">
            {t.home.headlineTop} <br />
            <span className="text-[#db2777] not-italic font-sans font-black tracking-tighter">{t.home.headlineAccent}</span> <br />
            {t.home.headlineBottom}
          </h2>
          <p className="text-xl text-black/60 max-w-lg font-medium leading-relaxed border-l-4 border-[#db2777] pl-6">{t.home.intro}</p>
          <div className="flex gap-6">
            <button
              onClick={() => setPage('blog')}
              className="bg-[#db2777] text-white border-2 border-black px-10 py-5 font-mono font-bold text-xs tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 uppercase"
            >
              {t.home.cta} <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="relative group">
          <RetroWindow title={t.home.previewTitle} color="bg-black" className="w-full">
            <div className="aspect-[16/10] bg-[#fdfcf8] relative overflow-hidden border-2 border-black">
              <img src="single.png" alt={t.home.previewHeading} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 space-y-3 text-left">
              <h3 className="text-2xl font-serif italic font-bold text-black">{t.home.previewHeading}</h3>
              <p className="text-sm text-black/60">{t.home.previewText}</p>
            </div>
          </RetroWindow>
        </div>
      </div>
    </section>

    <section className="py-32 bg-white border-y-2 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#db2777] mb-8">{t.home.bridgeKicker}</h4>
        <div className="relative left-1/2 mb-12 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-[#f2eee8]">
          <img src="tavus.png" alt={t.home.bridgeKicker} className="mx-auto h-[260px] w-full object-cover object-center md:h-[420px]" />
        </div>
        <p className="text-3xl font-serif italic max-w-3xl mx-auto leading-relaxed text-black/80">"{t.home.bridgeQuote}"</p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-8 py-32">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-6">
        <div className="space-y-4 text-left">
          <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#db2777]">{t.home.latestKicker}</h5>
          <h3 className="text-5xl font-serif italic font-bold text-black">{t.home.latestTitle}</h3>
        </div>
        <div className="h-0.5 flex-1 bg-black/10 mx-10 hidden md:block" />
        <button onClick={() => setPage('blog')} className="font-mono text-[10px] font-black uppercase tracking-widest bg-black text-white px-8 py-3 shadow-[4px_4px_0px_0px_rgba(219,39,119,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          {t.home.viewAll}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {postsLoading && (
          <div className="md:col-span-2 lg:col-span-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Yazılar yükleniyor...
          </div>
        )}
        {postsError && (
          <div className="md:col-span-2 lg:col-span-4 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#db2777]">
            Backend yazıları alınamadı. Varsayılan yazılar gösteriliyor.
          </div>
        )}
        {articles.map((article) => (
          <ArticleCard
            key={article.id || article.title}
            onClick={article.id ? () => onPostSelect(article.id) : undefined}
            {...article}
          />
        ))}
      </div>
    </section>
  </>
  );
};

export default HomePage;
