import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Home } from "./pages/Home";
import { NewsList } from "./pages/NewsList";
import { NewsDetail } from "./pages/NewsDetail";
import { ConsejeriaSuperiorPage } from "./pages/ConsejeriaSuperiorPage";
import { RegulationsPage } from "./pages/RegulationsPage";
import { TransparencyPage } from "./pages/TransparencyPage";
import { ElectionsPage } from "./pages/ElectionsPage";
import { AboutUs } from "./pages/AboutUs";
import { FAQPage } from "./pages/FAQPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { FacultiesPage } from "./pages/FacultiesPage";
import { FacultyDetail } from "./pages/FacultyDetail";
import { MinijuegosPage } from "./pages/MinijuegosPage";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import AsistenteChat from "./components/AsistenteChat";

import { NewsItem } from "./types";
import { NewsDraft } from "./lib/newsStore";
import { deleteNews, fetchNews, isNewsEditor, saveNews, toggleFeatured } from "./lib/newsApi";

const LegacyHashRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const previousPath = window.location.hash.replace(/^#/, "");

    if (previousPath.startsWith("/")) {
      navigate(previousPath, { replace: true });
    }
  }, [navigate]);

  return null;
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState('');

  const reloadNews = async () => {
    if (!isNewsEditor()) setNews([]);
    try {
      setNews(await fetchNews());
      setNewsError('');
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : 'No se pudieron cargar las noticias.');
      throw error;
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => { void reloadNews().catch(() => {}); }, []);

  const handleSaveNews = async (draft: NewsDraft, status: 'publicada' | 'borrador', author: string) => {
    await saveNews(draft, status, author);
    await reloadNews();
  };
  const handleDeleteNews = async (id: string) => {
    await deleteNews(id);
    await reloadNews();
  };
  const handleToggleFeatured = async (id: string) => {
    await toggleFeatured(id, !news.find(n => n.id === id)?.featured);
    await reloadNews();
  };

  return (
    <Router>
      <LegacyHashRedirect />
      <ScrollToTop />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home news={news} />} />
            <Route path="/noticias" element={<NewsList news={news} loading={newsLoading} error={newsError} />} />
            <Route
              path="/noticias/:slug"
              element={<NewsDetail news={news} loading={newsLoading} error={newsError} />}
            />
            <Route
              path="/consejeria-superior"
              element={<ConsejeriaSuperiorPage />}
            />
            <Route path="/reglamentos" element={<RegulationsPage />} />
            <Route path="/transparencia" element={<TransparencyPage />} />
            <Route path="/elecciones" element={<ElectionsPage />} />
            <Route path="/quienes-somos" element={<AboutUs />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/facultades" element={<FacultiesPage />} />
            <Route
              path="/facultades/:slug"
              element={<FacultyDetail />}
            />
            <Route path="/minijuegos" element={<MinijuegosPage />} />
            <Route
              path="/admin"
              element={
                <AdminDashboard
                  news={news}
                  loading={newsLoading}
                  error={newsError}
                  onReloadNews={reloadNews}
                  onSaveNews={handleSaveNews}
                  onDeleteNews={handleDeleteNews}
                  onToggleFeatured={handleToggleFeatured}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <AsistenteChat />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
