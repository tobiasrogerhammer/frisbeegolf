import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnePlayer from "./pages/onePlayer";
import Signup from "./pages/signup";
import PreviousGames from "./pages/myGames";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Signup />} />
          <Route path="/onePlayer" element={<OnePlayer />} />
          <Route path="/myGames" element={<PreviousGames />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
