import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Main } from "./pages/Main/Main";
import { Genre } from "./pages/Genre/Genre";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/genre/:id" element={<Genre />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
