import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

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
import { LoginPage } from "./pages/LoginPage";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import ProtectedRoute from "./routes/ProtectedRoute";
import { NewsItem } from "./types";
import { INITIAL_NEWS } from "./constants";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const handleAddNews = (newArticle: NewsItem) => {
    setNews((prev) => [newArticle, ...prev]);
  };

  return (
    <Router>
      <ScrollToTop />

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home news={news} />} />

            <Route path="noticias" element={<NewsList news={news} />} />
            <Route path="noticias/:slug" element={<NewsDetail news={news} />} />

            <Route path="consejeria-superior" element={<ConsejeriaSuperiorPage />} />
            <Route path="reglamentos" element={<RegulationsPage />} />
            <Route path="transparencia" element={<TransparencyPage />} />
            <Route path="quienes-somos" element={<AboutUs />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="facultades" element={<FacultiesPage />} />
            <Route path="facultades/:slug" element={<FacultyDetail />} />

            <Route path="login" element={<LoginPage />} />

            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard onAddNews={handleAddNews} />
                </ProtectedRoute>
              }
            />

            {/* Nunca quedes en blanco */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
