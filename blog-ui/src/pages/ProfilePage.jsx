import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  Code2,
  CheckSquare,
  Camera,
  Edit3,
  Eye,
  Globe,
  Mail,
  MessageCircle,
  Save,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import RetroWindow from '../components/common/RetroWindow.jsx';
import { getProfile } from '../services/authService';
import { getPosts } from '../services/postService';
import { formatPostDate, getPostItems } from '../utils/postMapper';

const tabs = [
  { id: 'dashboard', label: 'Özet', icon: Activity },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'content', label: 'İçerikler', icon: BookOpen },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

const notificationOptions = [
  'Yeni yorumlarda bildirim al',
  'Haftalık içerik özetini gönder',
  'Güvenlik uyarılarını e-posta ile bildir',
];

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

function normalizeId(value) {
  return value === undefined || value === null ? '' : String(value).trim().toLowerCase();
}

function getUserField(user, ...keys) {
  for (const key of keys) {
    if (user?.[key]) {
      return user[key];
    }
  }

  return '';
}

function getUserInfo(user, apiProfile) {
  const tokenPayload = readJwtPayload(localStorage.getItem('token'));
  const id =
    getUserField(user, 'id', 'Id', 'userId', 'UserId') ||
    apiProfile?.userId ||
    tokenPayload?.nameid ||
    tokenPayload?.sub ||
    tokenPayload?.userId ||
    tokenPayload?.UserId ||
    tokenPayload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

  const email =
    getUserField(user, 'email', 'Email') ||
    apiProfile?.email ||
    tokenPayload?.email ||
    tokenPayload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

  const fullName =
    getUserField(user, 'fullName', 'FullName', 'name', 'Name') ||
    tokenPayload?.unique_name ||
    tokenPayload?.name ||
    email ||
    'Kullanıcı';

  const role =
    getUserField(user, 'role', 'Role') ||
    apiProfile?.role ||
    tokenPayload?.role ||
    tokenPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    'User';

  return { id, email, fullName, role };
}

function getInitials(name) {
  return String(name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getStatusLabel(index) {
  return ['Yayında', 'İncelemede', 'Taslak'][index % 3];
}

function getStatusClass(status) {
  if (status === 'Yayında') {
    return 'bg-[#a7f3d0]';
  }

  if (status === 'İncelemede') {
    return 'bg-[#bfdbfe]';
  }

  return 'bg-[#fef08a]';
}

const ProfilePage = ({ setPage, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiProfile, setApiProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const userInfo = useMemo(() => getUserInfo(user, apiProfile), [user, apiProfile]);
  const profileStorageKey = `profile:${userInfo.id || userInfo.email || 'guest'}`;
  const [profileForm, setProfileForm] = useState({
    avatar: '',
    bio: '',
    website: '',
    github: '',
    instagram: '',
  });
  const [settingsForm, setSettingsForm] = useState({
    email: '',
    password: '',
    notifications: notificationOptions,
  });

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const [profileResponse, postsResponse] = await Promise.allSettled([
          getProfile(),
          getPosts({ pageNumber: 1, pageSize: 50 }),
        ]);

        if (profileResponse.status === 'fulfilled') {
          setApiProfile(profileResponse.value);
        }

        if (postsResponse.status === 'fulfilled') {
          setPosts(getPostItems(postsResponse.value));
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, []);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem(profileStorageKey) || '{}');

    setProfileForm({
      avatar: storedProfile.avatar || '',
      bio: storedProfile.bio || '',
      website: storedProfile.website || '',
      github: storedProfile.github || '',
      instagram: storedProfile.instagram || '',
    });

    setSettingsForm({
      email: storedProfile.email || userInfo.email || '',
      password: '',
      notifications: storedProfile.notifications || notificationOptions,
    });
  }, [profileStorageKey, userInfo.email]);

  const ownPosts = useMemo(() => {
    const currentUserId = normalizeId(userInfo.id);

    if (!currentUserId) {
      return [];
    }

    return posts.filter((post) => normalizeId(post.authorId || post.AuthorId) === currentUserId);
  }, [posts, userInfo.id]);

  const stats = [
    { label: 'Görüntülenme', value: ownPosts.length * 128 + 320, icon: Eye, color: 'bg-[#fef08a]' },
    { label: 'Yorum', value: ownPosts.length * 7, icon: MessageCircle, color: 'bg-[#bfdbfe]' },
    { label: 'Takipçi', value: ownPosts.length * 24 + 18, icon: Users, color: 'bg-[#a7f3d0]' },
  ];

  const activities = [
    `${userInfo.role} rolü ile giriş yapıldı.`,
    ownPosts[0] ? `"${ownPosts[0].title}" yazısı listelendi.` : 'Henüz sana ait yazı bulunamadı.',
    'Profil tercihleri tarayıcıda hazırlandı.',
  ];

  function saveLocalProfile(nextProfile = profileForm, nextSettings = settingsForm) {
    localStorage.setItem(
      profileStorageKey,
      JSON.stringify({
        ...nextProfile,
        email: nextSettings.email,
        notifications: nextSettings.notifications,
      })
    );
  }

  function saveProfile(event) {
    event.preventDefault();
    saveLocalProfile();
    setMessage('Profil bilgileri kaydedildi.');
  }

  function saveSettings(event) {
    event.preventDefault();
    saveLocalProfile();
    setSettingsForm((current) => ({ ...current, password: '' }));
    setMessage('Ayar tercihleri kaydedildi.');
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 flex flex-col gap-6 border-b-2 border-black pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-left">
            <div className="mb-4 inline-flex border-2 border-black bg-[#fef08a] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              PROFİL PANELİ
            </div>
            <h2 className="text-5xl font-serif italic font-black leading-tight text-black md:text-7xl">Hesabım</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60 md:text-base">
              Giriş yaptığın hesabı, profil detaylarını ve içeriklerini buradan takip edebilirsin.
            </p>
          </div>

          <div className="flex items-center gap-4 border-2 border-black bg-white p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-[#db2777] font-mono text-xl font-black text-white">
              {profileForm.avatar ? <img src={profileForm.avatar} alt={userInfo.fullName} className="h-full w-full object-cover" /> : getInitials(userInfo.fullName)}
            </div>
            <div className="min-w-0 text-left">
              <div className="truncate font-serif text-2xl font-black italic">{userInfo.fullName}</div>
              <div className="truncate font-mono text-[10px] font-black uppercase tracking-widest text-black/50">{userInfo.email || 'E-posta yok'}</div>
              <div className="mt-2 inline-flex items-center gap-2 border-2 border-black bg-[#a7f3d0] px-2 py-1 font-mono text-[9px] font-black uppercase">
                <Shield size={12} /> {userInfo.role}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <RetroWindow title="MENÜ" color="bg-[#bfdbfe]">
              <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 border-2 border-black px-4 py-3 font-mono text-[10px] font-black uppercase tracking-widest transition-colors lg:justify-start ${
                        activeTab === tab.id ? 'bg-black text-white' : 'bg-white hover:bg-[#fef08a]'
                      }`}
                    >
                      <Icon size={15} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </RetroWindow>
          </aside>

          <section className="space-y-8">
            {message && (
              <div className="border-2 border-black bg-[#a7f3d0] px-5 py-3 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {message}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <>
                <div className="grid gap-5 md:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div key={stat.label} className={`${stat.color} border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]`}>
                        <div className="mb-8 flex items-center justify-between">
                          <span className="font-mono text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                          <Icon size={20} />
                        </div>
                        <div className="font-serif text-5xl font-black italic">{stat.value}</div>
                      </div>
                    );
                  })}
                </div>

                <RetroWindow title="SON_AKTİVİTELER" color="bg-[#f472b6]">
                  <div className="space-y-4 text-left">
                    {activities.map((activity, index) => (
                      <div key={activity} className="flex gap-4 border-2 border-black bg-[#fdfcf8] p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-white font-mono text-[10px] font-black">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium leading-6 text-black/70">{activity}</p>
                      </div>
                    ))}
                    {loading && <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">Profil verileri yükleniyor...</p>}
                  </div>
                </RetroWindow>
              </>
            )}

            {activeTab === 'profile' && (
              <RetroWindow title="PROFİL_YÖNETİMİ" color="bg-[#a7f3d0]">
                <form onSubmit={saveProfile} className="grid gap-6 text-left lg:grid-cols-[220px_1fr]">
                  <div className="space-y-4">
                    <div className="flex aspect-square items-center justify-center overflow-hidden border-2 border-black bg-[#db2777] font-mono text-5xl font-black text-white">
                      {profileForm.avatar ? <img src={profileForm.avatar} alt={userInfo.fullName} className="h-full w-full object-cover" /> : getInitials(userInfo.fullName)}
                    </div>
                    <label className="block">
                      <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Avatar URL</span>
                      <input name="avatar" value={profileForm.avatar} onChange={(event) => setProfileForm((current) => ({ ...current, avatar: event.target.value }))} className="w-full border-2 border-black px-3 py-2 font-mono text-xs outline-none focus:bg-[#fef08a]" />
                    </label>
                  </div>

                  <div className="space-y-5">
                    <label className="block">
                      <span className="mb-2 block font-mono text-[10px] font-black uppercase tracking-widest text-black/50">Bio</span>
                      <textarea name="bio" value={profileForm.bio} onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))} rows={6} className="w-full resize-y border-2 border-black px-4 py-3 text-sm outline-none focus:bg-[#fef08a]" placeholder="Kendini kısa bir cümleyle anlat..." />
                    </label>

                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { name: 'website', label: 'Web', icon: Globe },
                        { name: 'github', label: 'Github', icon: Code2 },
                        { name: 'instagram', label: 'Instagram', icon: Camera },
                      ].map((field) => {
                        const Icon = field.icon;

                        return (
                          <label key={field.name} className="block">
                            <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                              <Icon size={13} /> {field.label}
                            </span>
                            <input name={field.name} value={profileForm[field.name]} onChange={(event) => setProfileForm((current) => ({ ...current, [field.name]: event.target.value }))} className="w-full border-2 border-black px-3 py-2 font-mono text-xs outline-none focus:bg-[#fef08a]" />
                          </label>
                        );
                      })}
                    </div>

                    <button className="inline-flex items-center gap-2 border-2 border-black bg-[#db2777] px-6 py-3 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black">
                      <Save size={15} /> Profili Kaydet
                    </button>
                  </div>
                </form>
              </RetroWindow>
            )}

            {activeTab === 'content' && (
              <RetroWindow title="İÇERİK_YÖNETİMİ" color="bg-[#fef08a]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-black font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                        <th className="p-3">Başlık</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3">Tarih</th>
                        <th className="p-3 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownPosts.map((post, index) => {
                        const status = getStatusLabel(index);

                        return (
                          <tr key={post.id || post.title} className="border-b-2 border-black/10">
                            <td className="p-3 font-serif text-lg font-black italic">{post.title}</td>
                            <td className="p-3 font-mono text-[10px] font-black uppercase text-black/50">{post.categoryName || 'GENEL'}</td>
                            <td className="p-3">
                              <span className={`${getStatusClass(status)} inline-flex border-2 border-black px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest`}>
                                {status}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-[10px] font-black uppercase text-black/40">{formatPostDate(post.createdAt)}</td>
                            <td className="p-3 text-right">
                              <button onClick={() => setPage(userInfo.role === 'Admin' ? 'adminPanel' : 'writerPanel')} className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white">
                                <Edit3 size={13} /> Yönet
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {ownPosts.length === 0 && (
                  <p className="mt-5 border-2 border-black bg-white p-4 font-mono text-[10px] font-black uppercase tracking-widest text-black/40">
                    Bu hesapla yazılmış içerik bulunamadı.
                  </p>
                )}
              </RetroWindow>
            )}

            {activeTab === 'settings' && (
              <RetroWindow title="AYARLAR" color="bg-[#bfdbfe]">
                <form onSubmit={saveSettings} className="space-y-6 text-left">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                        <Mail size={13} /> E-posta
                      </span>
                      <input name="email" type="email" value={settingsForm.email} onChange={(event) => setSettingsForm((current) => ({ ...current, email: event.target.value }))} className="w-full border-2 border-black px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]" />
                    </label>
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                        <Shield size={13} /> Yeni Şifre
                      </span>
                      <input name="password" type="password" value={settingsForm.password} onChange={(event) => setSettingsForm((current) => ({ ...current, password: event.target.value }))} className="w-full border-2 border-black px-4 py-3 font-mono text-sm outline-none focus:bg-[#fef08a]" placeholder="Backend bağlanınca aktif edilir" />
                    </label>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black/50">
                      <Bell size={14} /> Bildirim Tercihleri
                    </div>
                    <div className="grid gap-3">
                      {notificationOptions.map((option) => (
                        <label key={option} className="flex items-center gap-3 border-2 border-black bg-white p-4 text-sm font-bold">
                          <input
                            type="checkbox"
                            checked={settingsForm.notifications.includes(option)}
                            onChange={() =>
                              setSettingsForm((current) => ({
                                ...current,
                                notifications: current.notifications.includes(option)
                                  ? current.notifications.filter((item) => item !== option)
                                  : [...current.notifications, option],
                              }))
                            }
                            className="h-4 w-4 accent-black"
                          />
                          <CheckSquare size={15} /> {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 border-2 border-black bg-[#db2777] px-6 py-3 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black">
                    <Save size={15} /> Ayarları Kaydet
                  </button>
                </form>
              </RetroWindow>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
