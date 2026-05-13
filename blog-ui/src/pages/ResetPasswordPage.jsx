import { useMemo, useState } from 'react';
import { ArrowLeft, KeyRound, Save } from 'lucide-react';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { resetPassword } from '../services/authService';

const ResetPasswordPage = ({ setPage }) => {
  const token = useMemo(() => new URLSearchParams(window.location.search).get('token') || '', []);
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function goToLogin() {
    window.history.replaceState({}, '', '/');
    setPage('auth');
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      setError('Şifre yenileme bağlantısı geçersiz.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Yeni şifre ve tekrar alanı aynı olmalı.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await resetPassword({
        token,
        newPassword: form.newPassword,
      });

      setSuccess('Şifren güncellendi. Artık yeni şifrenle giriş yapabilirsin.');
      setForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Şifre güncellenemedi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] px-8 py-24">
      <div className="mx-auto max-w-xl">
        <RetroWindow title="ŞİFRE_YENİLE" color="bg-[#a7f3d0]">
          <div className="space-y-8 text-left">
            <div>
              <button
                type="button"
                onClick={goToLogin}
                className="mb-5 inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black"
              >
                <ArrowLeft size={14} /> Giriş ekranına dön
              </button>
              <h2 className="text-5xl font-serif italic font-black leading-tight text-black">Yeni şifre belirle</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black/60">
                E-postandaki bağlantıdan gelen doğrulama bilgisiyle hesabın için yeni şifre oluşturabilirsin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                  <KeyRound size={13} /> Yeni Şifre
                </span>
                <input
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  minLength={6}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                  <KeyRound size={13} /> Yeni Şifre Tekrar
                </span>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                  required
                />
              </label>

              {!token && (
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">
                  Bu bağlantıda token bulunamadı. Şifremi unuttum ekranından yeni bağlantı iste.
                </p>
              )}
              {error && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">{error}</p>}
              {success && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-green-700">{success}</p>}

              <button
                disabled={loading || !token}
                className="flex w-full items-center justify-center gap-3 border-2 border-black bg-[#db2777] px-8 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
