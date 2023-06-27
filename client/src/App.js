import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewGames from "./pages/newGames";
import Signup from "./pages/signup";
import PreviousGames from "./pages/previousGames";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Signup />} />
          <Route path="/newGames" element={<NewGames />} />
          <Route path="/previousGames" element={<PreviousGames />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
