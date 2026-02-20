import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Screentest from "./Pages/Screentest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screen-test" element={<Screentest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
