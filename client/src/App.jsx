import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  
useEffect (() =>{
  fetch('http://localhost:3001/api/movies')
    .then((res) => res.json())
    .then((data) => setMovies(data))
    .catch((err) => console.error('Something went wrong in fetch:', err));
}, []);

  return (
    <div>
      <h1>
        Marvel Movies
      </h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} ({movie.release_year})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;