import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { getPostById } from '../services/postService';
import { formatPostDate, getPostImage } from '../utils/postMapper';

const PostDetailPage = ({ postId, setPage }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      loadPost();
    }
  }, [postId]);

  return (
    <div className="bg-[#fdfcf8] min-h-screen px-8 py-24">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setPage('blog')}
          className="mb-10 inline-flex items-center gap-3 bg-black text-white px-6 py-3 text-[10px] font-mono font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(219,39,119,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          <ArrowLeft size={16} /> Bloga Dön
        </button>

        {loading && (
          <div className="text-center font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Yazı yükleniyor...
          </div>
        )}

        {error && (
          <RetroWindow title="HATA" color="bg-[#f472b6]">
            <p className="font-mono text-xs font-bold uppercase text-black/70">Yazı alınamadı: {error}</p>
          </RetroWindow>
        )}

        {post && (
          <article className="space-y-10 text-left">
            <div>
              <div className="mb-6 inline-flex border-2 border-black bg-[#fef08a] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {post.categoryName || 'GENEL'}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic font-black leading-tight text-black">{post.title}</h1>
              <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                {formatPostDate(post.createdAt)} // {post.authorId}
              </p>
            </div>

            <div className="overflow-hidden border-2 border-black bg-[#f2eee8]">
              <img src={getPostImage(post.title) || 'tavus.png'} alt={post.title} className="h-[260px] w-full object-cover md:h-[420px]" />
            </div>

            <RetroWindow title="POST_CONTENT" color="bg-[#a7f3d0]">
              <div className="whitespace-pre-line text-lg leading-8 text-black/75">{post.content}</div>
            </RetroWindow>
          </article>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
