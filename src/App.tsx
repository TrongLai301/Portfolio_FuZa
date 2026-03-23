import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import IntroPage from "./features/IntroPage";
import { ScrollProvider } from "./commons/ScrollProvider";

function App() {
  return (
    <Router>
      <ScrollProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IntroPage />} />
          </Route>
        </Routes>
      </ScrollProvider>
    </Router>
  );
}

export default App;
