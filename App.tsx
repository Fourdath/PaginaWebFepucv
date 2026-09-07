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
import { INITIAL_NEWS } from "./constants";
import { NewsDraft, commitDraft, loadNews, saveNews } from "./lib/newsStore";

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
  const [news, setNews] = useState<NewsItem[]>(() => loadNews(INITIAL_NEWS));

  const update = (next: NewsItem[]) => {
    setNews(next);
    saveNews(next);
  };

  const handleSaveNews = (draft: NewsDraft, status: 'publicada' | 'borrador', author: string) =>
    update(commitDraft(news, draft, status, author));

  const handleDeleteNews = (id: string) => update(news.filter((n) => n.id !== id));

  const handleToggleFeatured = (id: string) =>
    update(news.map((n) => ({ ...n, featured: n.id === id ? !n.featured : false })));

  return (
    <Router>
      <LegacyHashRedirect />
      <ScrollToTop />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home news={news} />} />
            <Route path="/noticias" element={<NewsList news={news} />} />
            <Route
              path="/noticias/:slug"
              element={<NewsDetail news={news} />}
            />
            <Route
              path="/consejeria-superior"
              element={<ConsejeriaSuperiorPage />}
            />
            <Route path="/reglamentos" element={<RegulationsPage />} />
            <Route path="/transparencia" element={<TransparencyPage />} />
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
