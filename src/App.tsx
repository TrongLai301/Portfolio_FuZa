import "./App.css";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import IntroPage from "./features/IntroPage";
import { ScrollProvider } from "./commons/ScrollProvider";
import { EnterProvider } from "./commons/EnterContext";
import { useEnter } from "./commons/useEnterContext";
import EnterScreen from "./components/EnterScreen";
import catUmbrella from "./assets/video/catUmbrella.mp4";
import { AuthProvider } from "./commons/AuthContext";
import Login from "./features/Admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./features/Admin/AdminLayout";
import Dashboard from "./features/Admin/Dashboard";
import SkillsManager from "./features/Admin/SkillsManager/index";
import MusicManager from "./features/Admin/MusicManager/index";
import MediaManager from "./features/Admin/MediaManager/index";
import CelebrationsManager from "./features/Admin/CelebrationsManager/index";
import ValorantManager from "./features/Admin/ValorantManager/index";
import { ConfigProvider, theme } from "antd";

function MainApp() {
  const { isEntered } = useEnter();

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
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          {/* Abstract galaxy/particles background video from reliable CDN */}
          <source src={catUmbrella} type="video/mp4" />
        </video>
      </div>

      <Routes>
        {/* Public Login Route (Independent of Enter Screen) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            {/* Future Admin sub-routes will go here */}
            <Route path="skills" element={<SkillsManager />} />
            <Route path="music" element={<MusicManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="celebrations" element={<CelebrationsManager />} />
            <Route path="valorant" element={<ValorantManager />} />
          </Route>
        </Route>

        {/* Main Portfolio Interaction */}
        <Route path="*" element={
          <>
            <EnterScreen />
            {isEntered && (
              <ScrollProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<IntroPage />} />
                  </Route>
                </Routes>
              </ScrollProvider>
            )}
          </>
        } />
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
          <MainApp />
        </EnterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
