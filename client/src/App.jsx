import { Routes, Route } from 'react-router-dom';
import './App.css';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/movies/:id" element={<MovieDetail />} />
    </Routes>
  );
}

export default App;