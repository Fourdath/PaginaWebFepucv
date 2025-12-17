
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { NewsList } from './pages/NewsList';
import { NewsDetail } from './pages/NewsDetail';
import { ServicesPage } from './pages/ServicesPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { AboutUs } from './pages/AboutUs';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NewsItem } from './types';
import { INITIAL_NEWS } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const handleAddNews = (newArticle: NewsItem) => {
    setNews([newArticle, ...news]);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home news={news} />} />
            <Route path="/noticias" element={<NewsList news={news} />} />
            <Route path="/noticias/:slug" element={<NewsDetail news={news} />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/reglamentos" element={<RegulationsPage />} />
            <Route path="/transparencia" element={<TransparencyPage />} />
            <Route path="/quienes-somos" element={<AboutUs />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboard onAddNews={handleAddNews} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
