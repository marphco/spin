import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import CookiePolicy from "./components/Policies/CookiePolicy.jsx";
import PrivacyPolicy from "./components/Policies/PrivacyPolicy.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
