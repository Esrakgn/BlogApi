import { useEffect, useState } from 'react';
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { createCategory, deleteCategory, getCategories } from '../../services/categoryService';
import { createPost, deletePost, getPosts, updatePost } from '../../services/postService';
import { getPostItems } from '../../utils/postMapper';
import RetroWindow from '../common/RetroWindow';

const emptyForm = {
  title: '',
  content: '',
  categoryId: '',
};

function normalizeId(value) {
  return value === undefined || value === null ? '' : String(value).trim().toLowerCase();
}

function readJwtPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getCurrentUserId(user) {
  const tokenPayload = readJwtPayload(localStorage.getItem('token'));

  return normalizeId(
    user?.id ||
      user?.Id ||
      user?.userId ||
      user?.UserId ||
      user?.authorId ||
      user?.AuthorId ||
      tokenPayload?.nameid ||
      tokenPayload?.sub ||
      tokenPayload?.userId ||
      tokenPayload?.UserId ||
      tokenPayload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
  );
}

function getUserRole(user) {
  return user?.Role || user?.role || '';
}

const PostManagementPanel = ({ mode, user }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [error, setError] = useState(null);
  const [categoryMessage, setCategoryMessage] = useState(null);

  const isAdmin = mode === 'admin';
  const userRole = getUserRole(user);
  const canPublishPost = isAdmin || userRole === 'Writer' || userRole === 'Author';

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [postsResponse, categoriesResponse] = await Promise.all([
        getPosts({ pageNumber: 1, pageSize: 50 }),
        getCategories(),
      ]);

      const allPosts = getPostItems(postsResponse);
      const currentUserId = getCurrentUserId(user);
      const visiblePosts = isAdmin
        ? allPosts
        : allPosts.filter((post) => normalizeId(post.authorId || post.AuthorId) === currentUserId);

      setPosts(visiblePosts);
      setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse?.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [isAdmin, user]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function startEdit(post) {
    setEditingPostId(post.id);
    setForm({
      title: post.title || '',
      content: post.content || '',
      categoryId: post.categoryId || '',
    });
  }

  function resetForm() {
    setEditingPostId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canPublishPost) {
      setError('Yazar olmadığınız için yazı gönderemezsiniz.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingPostId) {
        await updatePost(editingPostId, form);
      } else {
        await createPost(form);
      }

      resetForm();
      await loadData();
    } catch (err) {
      if (err.status === 403) {
        setError('Yazar olmadığınız için yazı gönderemezsiniz.');
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      setCategoryMessage('Kategori adı boş olamaz.');
      return;
    }

    try {
      setCategorySaving(true);
      setCategoryMessage(null);
      await createCategory({ name });
      setCategoryName('');
      setCategoryMessage('Kategori eklendi.');
      await loadData();
    } catch (err) {
      setCategoryMessage(err.message || 'Kategori eklenemedi.');
    } finally {
      setCategorySaving(false);
    }
  }

  async function handleCategoryDelete(category) {
    const categoryId = category.id || category.Id;
    const categoryLabel = category.name || category.Name;
    const confirmed = window.confirm(`"${categoryLabel}" kategorisini silmek istediğine emin misin?`);

    if (!confirmed) {
      return;
    }

    try {
      setCategoryMessage(null);
      await deleteCategory(categoryId);
      setCategoryMessage('Kategori silindi.');
      await loadData();
    } catch (err) {
      if (err.status === 409) {
        setCategoryMessage('Bu kategori yazılarda kullanıldığı için silinemez.');
      } else {
        setCategoryMessage(err.message || 'Kategori silinemedi.');
      }
    }
  }

  async function handleDelete(postId) {
    const confirmed = window.confirm('Bu yazıyı silmek istediğine emin misin?');

    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      await deletePost(postId);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-left">
          <div className="mb-4 inline-block border-2 border-black bg-[#fef08a] px-4 py-1 font-mono text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {isAdmin ? 'ADMIN PANELİ' : 'YAZAR PANELİ'}
          </div>
          <h2 className="text-5xl font-serif italic font-black text-black">
            {isAdmin ? 'Tüm Yazıları Yönet' : 'Yazılarını Yönet'}
          </h2>
          <p className="mt-4 max-w-2xl text-black/60">
            {user?.FullName || user?.fullName || user?.Email || user?.email} olarak giriş yaptın. Bu panelden yazı ekleyebilir, güncelleyebilir ve silebilirsin.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <div className="space-y-8">
          {isAdmin && (
            <RetroWindow title="KATEGORİ_EKLE" color="bg-[#fef08a]">
              <form onSubmit={handleCategorySubmit} className="space-y-4 text-left">
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Kategori Adı</span>
                  <input
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Örn: Machine Learning"
                    className="w-full border-2 border-black px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  />
                </label>
                {categoryMessage && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/50">{categoryMessage}</p>}
                <button
                  disabled={categorySaving}
                  className="inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-5 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(219,39,119,1)] hover:bg-[#db2777] disabled:opacity-60"
                >
                  <Plus size={15} /> {categorySaving ? 'Ekleniyor...' : 'Kategori Ekle'}
                </button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category.id || category.Id} className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[9px] font-black uppercase tracking-widest">
                    {category.name || category.Name}
                    <button
                      type="button"
                      onClick={() => handleCategoryDelete(category)}
                      className="border-l-2 border-black pl-2 text-[#db2777] hover:text-black"
                      aria-label={`${category.name || category.Name} kategorisini sil`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </RetroWindow>
          )}
          <RetroWindow title={editingPostId ? 'YAZI_GÜNCELLE' : 'YENİ_YAZI'} color={editingPostId ? 'bg-[#bfdbfe]' : 'bg-[#a7f3d0]'}>
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Başlık</span>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border-2 border-black px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Kategori</span>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  required
                >
                  <option value="">Kategori seç</option>
                  {categories.map((category) => (
                    <option key={category.id || category.Id} value={category.id || category.Id}>
                      {category.name || category.Name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">İçerik</span>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={10}
                  className="w-full resize-y border-2 border-black px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  required
                />
              </label>

              {error && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">{error}</p>}

              <div className="flex gap-3">
                <button
                  disabled={saving || !canPublishPost}
                  className="inline-flex flex-1 items-center justify-center gap-2 border-2 border-black bg-[#db2777] px-5 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black disabled:opacity-60"
                >
                  {editingPostId ? <Save size={15} /> : <Plus size={15} />}
                  {saving ? 'Kaydediliyor...' : editingPostId ? 'Güncelle' : 'Yayınla'}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center border-2 border-black bg-white px-4 py-4 hover:bg-black hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </RetroWindow>

          </div>

          <RetroWindow title="YAZI_LİSTESİ" color="bg-[#f472b6]">
            {loading ? (
              <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">Yazılar yükleniyor...</p>
            ) : (
              <div className="space-y-4 text-left">
                {posts.map((post) => (
                  <div key={post.id} className="border-2 border-black bg-[#fdfcf8] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-2 font-mono text-[9px] font-black uppercase tracking-widest text-[#db2777]">{post.categoryName || 'GENEL'}</div>
                        <h3 className="text-2xl font-serif italic font-black leading-tight">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-black/60">{post.content}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button onClick={() => startEdit(post)} className="border-2 border-black bg-white p-3 hover:bg-black hover:text-white">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="border-2 border-black bg-white p-3 hover:bg-[#db2777] hover:text-white">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">Henüz yazı yok.</p>}
              </div>
            )}
          </RetroWindow>
        </div>
      </div>
    </div>
  );
};

export default PostManagementPanel;
