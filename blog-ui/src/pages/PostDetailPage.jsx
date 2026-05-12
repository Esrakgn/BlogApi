import { useEffect, useState } from 'react';
import { ArrowLeft, Edit3, MessageCircle, Save, Send, Trash2, X } from 'lucide-react';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { createComment, deleteComment, getCommentsByPostId, updateComment } from '../services/commentService';
import { getPostById } from '../services/postService';
import { formatPostDate, getPostImage } from '../utils/postMapper';

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

function getCommentId(comment) {
  return comment.id || comment.Id;
}

function getCommentUserId(comment) {
  return comment.userId || comment.UserId;
}

function getCommentItems(response) {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.items || response?.data || response?.comments || [];
}

function canManageComment(comment, currentUserId, isAdmin) {
  const commentUserId = normalizeId(getCommentUserId(comment));

  return Boolean(isAdmin || (currentUserId && commentUserId && commentUserId === currentUserId));
}

const PostDetailPage = ({ postId, setPage, user }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [savingComment, setSavingComment] = useState(false);
  const currentUserId = getCurrentUserId(user);
  const isAdmin = getUserRole(user) === 'Admin';

  useEffect(() => {
    async function loadPostDetail() {
      try {
        setLoading(true);
        setError(null);
        setCommentsError(null);

        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

      try {
        setCommentsLoading(true);
        const commentsResponse = await getCommentsByPostId(postId);
        setComments(getCommentItems(commentsResponse));
      } catch (err) {
        setCommentsError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    }

    if (postId) {
      loadPostDetail();
    }
  }, [postId]);

  async function loadComments() {
    try {
      setCommentsLoading(true);
      setCommentsError(null);

      const commentsResponse = await getCommentsByPostId(postId);
      setComments(getCommentItems(commentsResponse));
    } catch (err) {
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleCreateComment(event) {
    event.preventDefault();

    if (!commentContent.trim()) {
      return;
    }

    try {
      setSavingComment(true);
      setCommentsError(null);

      await createComment(postId, { content: commentContent.trim() });
      setCommentContent('');
      await loadComments();
    } catch (err) {
      setCommentsError(err.status === 401 ? 'Yorum yapmak için giriş yapmalısın.' : err.message);
    } finally {
      setSavingComment(false);
    }
  }

  function startEditComment(comment) {
    setEditingCommentId(getCommentId(comment));
    setEditingContent(comment.content || comment.Content || '');
    setCommentsError(null);
  }

  function cancelEditComment() {
    setEditingCommentId(null);
    setEditingContent('');
  }

  async function handleUpdateComment(comment) {
    if (!editingContent.trim()) {
      return;
    }

    if (!canManageComment(comment, currentUserId, isAdmin)) {
      setCommentsError('Sadece kendi yorumunu düzenleyebilirsin.');
      return;
    }

    try {
      setSavingComment(true);
      setCommentsError(null);

      const commentId = getCommentId(comment);
      await updateComment(commentId, { content: editingContent.trim() });
      cancelEditComment();
      await loadComments();
    } catch (err) {
      setCommentsError(err.status === 403 ? 'Bu yorumu düzenleme yetkin yok.' : err.message);
    } finally {
      setSavingComment(false);
    }
  }

  async function handleDeleteComment(comment) {
    if (!canManageComment(comment, currentUserId, isAdmin)) {
      setCommentsError('Sadece kendi yorumunu silebilirsin.');
      return;
    }

    const confirmed = window.confirm('Bu yorumu silmek istediğine emin misin?');

    if (!confirmed) {
      return;
    }

    try {
      setCommentsError(null);
      const commentId = getCommentId(comment);
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      setCommentsError(err.status === 403 ? 'Bu yorumu silme yetkin yok.' : err.message);
    }
  }

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
              <img src={getPostImage(post.title) || '/images/ui/tavus.png'} alt={post.title} className="h-[260px] w-full object-cover md:h-[420px]" />
            </div>

            <RetroWindow title="POST_CONTENT" color="bg-[#a7f3d0]">
              <div className="whitespace-pre-line text-lg leading-8 text-black/75">{post.content}</div>
            </RetroWindow>

            <RetroWindow title="YORUMLAR" color="bg-[#bfdbfe]">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-black/10 pb-4">
                  <MessageCircle size={18} />
                  <h2 className="font-mono text-[10px] font-black uppercase tracking-widest">
                    {comments.length} yorum
                  </h2>
                </div>

                {user ? (
                  <form onSubmit={handleCreateComment} className="space-y-3">
                    <textarea
                      value={commentContent}
                      onChange={(event) => setCommentContent(event.target.value)}
                      rows={4}
                      className="w-full resize-y border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                      placeholder="Yorumunu yaz..."
                      required
                    />
                    <button
                      disabled={savingComment}
                      className="inline-flex items-center gap-2 border-2 border-black bg-[#db2777] px-6 py-3 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black disabled:opacity-60"
                    >
                      <Send size={15} /> {savingComment ? 'Gönderiliyor...' : 'Yorum Gönder'}
                    </button>
                  </form>
                ) : (
                  <p className="border-2 border-black bg-white p-4 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                    Yorum yapmak için giriş yapmalısın.
                  </p>
                )}

                {commentsError && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">{commentsError}</p>}

                {commentsLoading ? (
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">Yorumlar yükleniyor...</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => {
                      const commentId = getCommentId(comment);
                      const canEditOrDelete = canManageComment(comment, currentUserId, isAdmin);
                      const isEditing = editingCommentId === commentId;

                      return (
                        <div key={commentId} className="border-2 border-black bg-[#fdfcf8] p-5">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="mb-3 font-mono text-[9px] font-black uppercase tracking-widest text-[#db2777]">
                                {comment.userName || comment.UserName || 'Kullanıcı'} // {formatPostDate(comment.createdAt || comment.CreatedAt)}
                              </div>
                              {isEditing ? (
                                <textarea
                                  value={editingContent}
                                  onChange={(event) => setEditingContent(event.target.value)}
                                  rows={4}
                                  className="w-full resize-y border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                                />
                              ) : (
                                <p className="whitespace-pre-line text-sm leading-6 text-black/70">{comment.content || comment.Content}</p>
                              )}
                            </div>

                            {canEditOrDelete && (
                              <div className="flex shrink-0 gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateComment(comment)}
                                      disabled={savingComment}
                                      className="border-2 border-black bg-white p-3 hover:bg-black hover:text-white disabled:opacity-60"
                                    >
                                      <Save size={16} />
                                    </button>
                                    <button type="button" onClick={cancelEditComment} className="border-2 border-black bg-white p-3 hover:bg-black hover:text-white">
                                      <X size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button type="button" onClick={() => startEditComment(comment)} className="border-2 border-black bg-white p-3 hover:bg-black hover:text-white">
                                      <Edit3 size={16} />
                                    </button>
                                    <button type="button" onClick={() => handleDeleteComment(comment)} className="border-2 border-black bg-white p-3 hover:bg-[#db2777] hover:text-white">
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {comments.length === 0 && (
                      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">Henüz yorum yok.</p>
                    )}
                  </div>
                )}
              </div>
            </RetroWindow>
          </article>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
