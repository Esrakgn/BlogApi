import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Marquee from './components/common/Marquee.jsx';
import NewsletterSection from './components/common/NewsletterSection.jsx';
import HomePage from './pages/HomePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import WriterPanelPage from './pages/WriterPanelPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { translations } from './i18n/translations.js';

export default function App() {
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState('tr');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home');
  }

  function openUserPanel() {
    const role = user?.Role || user?.role;
    setPage(role === 'Admin' ? 'adminPanel' : 'writerPanel');
  }

  return (
    <div className="min-h-screen selection:bg-[#db2777] selection:text-white bg-[#fdfcf8] text-black font-sans">
      <Navbar language={language} onLogout={handleLogout} onPanelClick={openUserPanel} setLanguage={setLanguage} setPage={setPage} t={t.nav} user={user} />

      <main>
        {page === 'home' && (
          <HomePage
            onPostSelect={(postId) => {
              setSelectedPostId(postId);
              setPage('postDetail');
            }}
            setPage={setPage}
            t={t}
          />
        )}
        {page === 'blog' && (
          <BlogPage
            onPostSelect={(postId) => {
              setSelectedPostId(postId);
              setPage('postDetail');
            }}
            t={t}
          />
        )}
        {page === 'postDetail' && <PostDetailPage postId={selectedPostId} setPage={setPage} user={user} />}
        {page === 'pricing' && <PricingPage t={t.pricing} />}
        {page === 'profile' &&
          (user ? (
            <ProfilePage onLogout={handleLogout} setPage={setPage} user={user} />
          ) : (
            <AuthPage
              onAuthSuccess={(authUser) => {
                setUser(authUser);
                setPage('profile');
              }}
            />
          ))}
        {page === 'auth' && (
          <AuthPage
            onAuthSuccess={(authUser) => {
              setUser(authUser);
              setPage('home');
            }}
          />
        )}
        {page === 'adminPanel' && <AdminPanelPage user={user} />}
        {page === 'writerPanel' && <WriterPanelPage user={user} />}
        <Marquee text={t.marquee} />
        <NewsletterSection t={t.newsletter} />
      </main>

      <Footer t={t.footer} />
    </div>
  );
}
