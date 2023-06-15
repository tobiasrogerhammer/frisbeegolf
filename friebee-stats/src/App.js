import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnePlayer from "./pages/onePlayer";
import Signup from "./pages/signup";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<OnePlayer />} />
          <Route path="/onePlayer" element={<OnePlayer />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
