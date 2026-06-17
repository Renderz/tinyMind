import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, AnimatePresence, domAnimation } from "framer-motion";
import { HomePage } from "../pages/HomePage";
import { SchultePage } from "../games/schulte/SchultePage";
import { MemoryPage } from "../games/memory-match/MemoryPage";

export function App() {
  return (
    <LazyMotion strict features={domAnimation}>
      <BrowserRouter basename="/tinyMind">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schulte" element={<SchultePage />} />
            <Route path="/memory" element={<MemoryPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </LazyMotion>
  );
}
