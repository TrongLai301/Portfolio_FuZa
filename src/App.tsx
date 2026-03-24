import "./App.css";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import IntroPage from "./features/IntroPage";
import { ScrollProvider } from "./commons/ScrollProvider";
import { EnterProvider, useEnter } from "./commons/EnterContext";
import EnterScreen from "./components/EnterScreen";
import catUmbrella from "./assets/video/catUmbrella.mp4"
function MainApp() {
  const { isEntered } = useEnter();

  return (
    <>
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
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <EnterProvider>
        <MainApp />
      </EnterProvider>
    </Router>
  );
}

export default App;
