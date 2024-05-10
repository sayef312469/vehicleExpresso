import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarTop from "./components/NavbarTop";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SearchParking from "./pages/SearchPaking";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavbarTop />
        <div className="pages">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
            <Routes>
              <Route path="/searchparks" element={<SearchParking />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
