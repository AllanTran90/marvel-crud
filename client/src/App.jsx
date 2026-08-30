import { Routes, Route } from "react-router-dom";
import "./App.css";
import MovieList from "./MovieList";
import MovieDetail from "./MovieDetail";
import ActorDetail from "./ActorDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/movies/:id" element={<MovieDetail />} />
      <Route path="/actors/:id" element={<ActorDetail />} />
    </Routes>
  );
}

export default App;
