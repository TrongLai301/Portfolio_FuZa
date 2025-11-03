import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import IntroPage from "./components/IntroPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IntroPage />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
