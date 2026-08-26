import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  
useEffect (() =>{
  fetch('http://localhost:3001/api/movies')
    .then((res) => res.json())
    .then((data) => setMovies(data))
    .catch((err) => console.error('Something went wrong in fetch:', err));
}, []);

const handleSubmit = (e) => {
  e.preventDefault();

  fetch('http://localhost:3001/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, releaseYear: releaseYear }),
    })

      .then((res) => res.json())
      .then((newMovie) => {
        setMovies([...movies, newMovie]);
        setTitle('');
        setReleaseYear('');
      })
      .catch((err) => console.error('Something went wrong when adding movie:', err));
  };

  return (
    <div>
      <h1>
        Marvel Movies
      </h1>

           <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button type="submit">Add movie</button>

      </form>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} ({movie.releaseYear})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;