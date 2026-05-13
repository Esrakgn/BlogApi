import { useEffect, useMemo, useState } from 'react';
import {
  Brain,
  Briefcase,
  Code2,
  Database,
  Gamepad2,
  Globe2,
  Layers3,
  Lightbulb,
  Newspaper,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react';
import ArticleCard from '../components/articles/ArticleCard.jsx';
import { getCategories } from '../services/categoryService';
import { getPosts } from '../services/postService';
import { getPostItems, mapPostToArticle } from '../utils/postMapper';

function getCategoryId(category) {
  return category?.id || category?.Id || '';
}

function getCategoryName(category) {
  return category?.name || category?.Name || 'Kategori';
}

function getCategoryIcon(name) {
  const normalizedName = String(name || '').toLowerCase();

  if (normalizedName.includes('yapay') || normalizedName.includes('ai') || normalizedName.includes('machine')) {
    return Brain;
  }

  if (normalizedName.includes('data') || normalizedName.includes('veri') || normalizedName.includes('sql')) {
    return Database;
  }

  if (normalizedName.includes('web') || normalizedName.includes('api')) {
    return Globe2;
  }

  if (normalizedName.includes('mobil') || normalizedName.includes('mobile')) {
    return Smartphone;
  }

  if (normalizedName.includes('güven') || normalizedName.includes('security') || normalizedName.includes('siber')) {
    return Shield;
  }

  if (normalizedName.includes('startup') || normalizedName.includes('girişim')) {
    return Rocket;
  }

  if (normalizedName.includes('iş') || normalizedName.includes('business')) {
    return Briefcase;
  }

  if (normalizedName.includes('oyun') || normalizedName.includes('gaming')) {
    return Gamepad2;
  }

  if (normalizedName.includes('topluluk') || normalizedName.includes('community')) {
    return Users;
  }

  if (normalizedName.includes('ürün') || normalizedName.includes('product')) {
    return Layers3;
  }

  return Code2;
}

const ReadPage = ({ initialSearch = '', onPostSelect, setBlogSearch }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [searchText, setSearchText] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1 });
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) {
      return 'Tüm Yazılar';
    }

    const selectedCategory = categories.find((category) => getCategoryId(category) === selectedCategoryId);
    return selectedCategory ? getCategoryName(selectedCategory) : 'Seçili Kategori';
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    setSearchText(initialSearch);
    setActiveSearch(initialSearch);
    setPageNumber(1);
  }, [initialSearch]);

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

  useEffect(() => {
    async function loadPosts() {
      try {
        setPostsLoading(true);
        setPostsError(null);

        const response = await getPosts({
          pageNumber,
          pageSize: 9,
          sortBy,
          categoryId: selectedCategoryId || undefined,
          search: activeSearch || undefined,
        });
        const items = getPostItems(response);

        setPosts(items.map((post, index) => mapPostToArticle(post, index)));
        setPagination({
          totalCount: response?.totalCount || items.length,
          totalPages: response?.totalPages || 1,
        });
      } catch (error) {
        setPostsError(error.message);
      } finally {
        setPostsLoading(false);
      }
    }

    loadPosts();
  }, [activeSearch, pageNumber, selectedCategoryId, sortBy]);

  function handleCategoryChange(categoryId) {
    setSelectedCategoryId(categoryId);
    setPageNumber(1);
  }

  function handleSearch(event) {
    event.preventDefault();
    const nextSearch = searchText.trim();

    setActiveSearch(nextSearch);
    setBlogSearch?.(nextSearch);
    setPageNumber(1);
  }

  function clearFilters() {
    setSelectedCategoryId('');
    setSortBy('newest');
    setSearchText('');
    setActiveSearch('');
    setBlogSearch?.('');
    setPageNumber(1);
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <section className="border-b-2 border-black bg-[#1f1f1f] px-6 py-14 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex border-2 border-[#0f766e] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.35em] text-[#a7f3d0]">
              THE_RELAY / READ
            </div>
            <h2 className="font-serif text-5xl font-black italic leading-tight md:text-7xl">Okuma Akışı</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-6 text-white/60 md:text-base">
              Yazılım, teknoloji ve dijital dünya üzerine yazıları kategoriye göre seç, oku ve keşfet.
            </p>
          </div>

          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => handleCategoryChange('')}
              className={`inline-flex items-center gap-2 rounded-md border px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-colors ${
                selectedCategoryId === ''
                  ? 'border-[#f472b6] bg-[#f472b6] text-black'
                  : 'border-[#0f766e] bg-[#202020] text-white/80 hover:border-[#f472b6] hover:text-white'
              }`}
            >
              <Newspaper size={16} /> Tüm Yazılar
            </button>

            {categories.map((category) => {
              const categoryId = getCategoryId(category);
              const categoryName = getCategoryName(category);
              const Icon = getCategoryIcon(categoryName);

              return (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => handleCategoryChange(categoryId)}
                  className={`inline-flex items-center gap-2 rounded-md border px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-colors ${
                    selectedCategoryId === categoryId
                      ? 'border-[#f472b6] bg-[#f472b6] text-black'
                      : 'border-[#0f766e] bg-[#202020] text-white/80 hover:border-[#f472b6] hover:text-white'
                  }`}
                >
                  <Icon size={16} /> {categoryName}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-2 border-black bg-white p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] lg:flex-row lg:items-center lg:justify-between">
            <div className="text-left">
              <h3 className="font-serif text-4xl font-black italic">{selectedCategoryName}</h3>
              <p className="mt-1 font-mono text-[10px] font-black uppercase tracking-widest text-black/40">
                {pagination.totalCount} yazı listeleniyor
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <form onSubmit={handleSearch} className="flex border-2 border-black bg-[#fdfcf8]">
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Yazılarda ara"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest outline-none placeholder:text-black/30 md:w-56"
                />
                <button type="submit" className="border-l-2 border-black px-4 hover:bg-[#fef08a]" aria-label="Ara">
                  <Search size={16} />
                </button>
              </form>

              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPageNumber(1);
                }}
                className="border-2 border-black bg-[#fdfcf8] px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest outline-none focus:bg-[#fef08a]"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="border-2 border-black bg-white px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white"
              >
                Temizle
              </button>
            </div>
          </div>

          {categoriesError && (
            <div className="mb-8 border-2 border-black bg-[#fef08a] p-4 text-center font-mono text-[10px] font-black uppercase tracking-widest">
              Kategoriler alınamadı.
            </div>
          )}

          {postsLoading && (
            <div className="mb-8 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              Yazılar yükleniyor...
            </div>
          )}

          {postsError && (
            <div className="mb-8 border-2 border-black bg-white p-4 text-center font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">
              Yazılar alınamadı.
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id || post.title} onClick={() => post.id && onPostSelect(post.id)} {...post} />
            ))}
          </div>

          {!postsLoading && posts.length === 0 && !postsError && (
            <div className="mt-10 border-2 border-black bg-white p-8 text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              Bu seçim için yazı bulunamadı.
            </div>
          )}

          {pagination.totalPages > 1 && !postsError && (
            <div className="mt-12 flex items-center justify-center gap-4">
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
        </div>
      </section>
    </div>
  );
};

export default ReadPage;
