import { useState } from 'react';
import { ArrowLeft, LogIn, PenLine, ShieldCheck, User, UserPlus } from 'lucide-react';
import { login, register } from '../services/authService';
import RetroWindow from '../components/common/RetroWindow.jsx';

function getToken(response) {
  return response?.token || response?.Token;
}

const AuthPage = ({ onAuthSuccess }) => {
  const [accountType, setAccountType] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isLogin = mode === 'login';

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleAccountTypeSelect(type) {
    setAccountType(type);
    setMode(type === 'Admin' ? 'login' : mode);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = isLogin
        ? await login(form.email, form.password)
        : await register({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            role: accountType,
          });

      const token = getToken(response);

      if (!isLogin) {
        setMode('login');
        setSuccess('Kayıt başarılı. Şimdi giriş yapabilirsin.');
        setForm((current) => ({ ...current, fullName: '', password: '' }));
        return;
      }

      if (!token) {
        throw new Error('Token alınamadı');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response));
      onAuthSuccess(response);
    } catch (err) {
      setError(err.message || 'İşlem tamamlanamadı');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] px-8 py-24">
      <div className="mx-auto max-w-xl">
        <RetroWindow title={accountType ? (isLogin ? 'GİRİŞ_PANELİ' : 'KAYIT_PANELİ') : 'HESAP_SEÇİMİ'} color={isLogin ? 'bg-[#a7f3d0]' : 'bg-[#f472b6]'}>
          {!accountType ? (
            <div className="space-y-8 text-left">
              <div>
                <h2 className="text-5xl font-serif italic font-black leading-tight text-black">Nasıl devam edeceksin?</h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/60">
                  Hesap türünü seçip giriş veya kayıt işlemine devam edebilirsin.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect('User')}
                  className="border-2 border-black bg-white p-5 text-left transition-all hover:bg-[#fef08a]"
                >
                  <User size={24} />
                  <h3 className="mt-4 font-mono text-[11px] font-black uppercase tracking-widest">User</h3>
                  <p className="mt-2 text-sm text-black/60">Yazıları okumak ve yorum yapmak için devam et.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect('Author')}
                  className="border-2 border-black bg-white p-5 text-left transition-all hover:bg-[#fef08a]"
                >
                  <PenLine size={24} />
                  <h3 className="mt-4 font-mono text-[11px] font-black uppercase tracking-widest">Author</h3>
                  <p className="mt-2 text-sm text-black/60">Yazı yayınlamak ve kendi yazılarını yönetmek için devam et.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccountTypeSelect('Admin')}
                  className="border-2 border-black bg-white p-5 text-left transition-all hover:bg-[#fef08a]"
                >
                  <ShieldCheck size={24} />
                  <h3 className="mt-4 font-mono text-[11px] font-black uppercase tracking-widest">Admin</h3>
                  <p className="mt-2 text-sm text-black/60">Admin hesabınla tüm yönetim işlemleri için giriş yap.</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 text-left">
              <div>
                <button
                  type="button"
                  onClick={() => setAccountType(null)}
                  className="mb-5 inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black"
                >
                  <ArrowLeft size={14} /> Seçime dön
                </button>
                <h2 className="text-5xl font-serif italic font-black leading-tight text-black">
                  {isLogin ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
                </h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/60">
                  {accountType === 'Admin'
                    ? 'Admin hesabınla yönetim paneline giriş yapabilirsin.'
                    : accountType === 'Author'
                    ? 'Yazar hesabınla yazılarını yönetebilirsin.'
                    : 'User hesabınla içerikleri takip edebilirsin.'}
                </p>
              </div>

              <div className="flex border-2 border-black bg-white p-1 font-mono text-[10px] font-black uppercase tracking-widest">
                <button onClick={() => setMode('login')} className={`flex-1 px-4 py-3 ${isLogin ? 'bg-black text-white' : 'hover:bg-black/5'}`} type="button">
                  Giriş
                </button>
                {accountType !== 'Admin' && (
                  <button onClick={() => setMode('register')} className={`flex-1 border-l-2 border-black px-4 py-3 ${!isLogin ? 'bg-black text-white' : 'hover:bg-black/5'}`} type="button">
                    Kayıt
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Ad Soyad</span>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                      required
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">E-posta</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Şifre</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]"
                    required
                  />
                </label>

                {error && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-[#db2777]">{error}</p>}
                {success && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-green-700">{success}</p>}

                <button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 border-2 border-black bg-[#db2777] px-8 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </button>
              </form>
            </div>
          )}
        </RetroWindow>
      </div>
    </div>
  );
};

export default AuthPage;
