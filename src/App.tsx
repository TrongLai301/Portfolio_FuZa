import { useRef, useEffect } from "react";
import "./App.css";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import IntroPage from "./features/IntroPage";
import { ScrollProvider } from "./commons/ScrollProvider";
import { EnterProvider } from "./commons/EnterContext";
import { useEnter } from "./commons/useEnterContext";
import EnterScreen from "./components/EnterScreen";
import { AuthProvider } from "./commons/AuthContext";
import Login from "./features/Admin/Login";
import SocialLinksManager from "./features/Admin/SocialLinksManager";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./features/Admin/AdminLayout";
import Dashboard from "./features/Admin/Dashboard";
import SkillsManager from "./features/Admin/SkillsManager/index";
import MusicManager from "./features/Admin/MusicManager/index";
import MediaManager from "./features/Admin/MediaManager/index";
import CelebrationsManager from "./features/Admin/CelebrationsManager/index";
import ValorantManager from "./features/Admin/ValorantManager/index";
import HeroManager from "./features/Admin/HeroManager/index";
import ThemeManager from "./features/Admin/ThemeManager/index";
import { ConfigProvider, theme } from "antd";
import { PortfolioProvider, usePortfolio } from "./commons/PortfolioContext";
import { MusicProvider } from "./commons/MusicContext";

function MainApp() {
  const { isEntered } = useEnter();
  const { heroSettings, loading, isVideoPlaying } = usePortfolio();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Safely play video without spamming AbortError when interrupted by load/pause
  const safePlayVideo = () => {
    if (!videoRef.current) return;
    const promise = videoRef.current.play();
    if (promise !== undefined) {
      promise.catch((e: any) => {
        if (e?.name !== "AbortError" && e?.name !== "NotAllowedError") {
          console.debug("Autoplay prevented:", e);
        }
      });
    }
  };

  // Manually trigger video load when the background URL changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isVideoPlaying) {
        safePlayVideo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSettings?.video_bg_url]);

  // React to play/pause state changes
  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        safePlayVideo();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 16,
          fontFamily: "Inter, system-ui, sans-serif",
        },
      }}
    >
      {/* Global Animated Background Video */}
      <div className="fixed inset-0 -z-50 bg-[#0a0a0a]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            loading ? "opacity-0" : "opacity-30"
          }`}
        >
          {heroSettings?.video_bg_url && (
            <source src={heroSettings.video_bg_url} type="video/mp4" />
          )}
        </video>
      </div>

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="theme" element={<ThemeManager />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="music" element={<MusicManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="celebrations" element={<CelebrationsManager />} />
            <Route path="valorant" element={<ValorantManager />} />
            <Route path="social" element={<SocialLinksManager />} />
          </Route>
        </Route>

        {/* Main Portfolio Routes */}
        <Route
          path="/"
          element={
            !isEntered ? (
              <EnterScreen />
            ) : (
              <ScrollProvider>
                <Layout />
              </ScrollProvider>
            )
          }
        >
          <Route index element={<IntroPage />} />
        </Route>

        {/* Fallback to Main Portfolio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Toaster position="top-right" richColors />
      <AuthProvider>
        <EnterProvider>
          <PortfolioProvider>
            <MusicProvider>
              <MainApp />
            </MusicProvider>
          </PortfolioProvider>
        </EnterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
