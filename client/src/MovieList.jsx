import { useState, useEffect } from 'react'
import MovieCard from './MovieCard';
import styles from './MovieList.module.css';
import { API_URL } from './api';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error('Something went wrong in fetch:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, releaseYear }),
    })
      .then((res) => res.json())
      .then((newMovie) => {
        setMovies([...movies, newMovie]);
        setTitle('');
        setReleaseYear('');
      })
      .catch((err) => console.error('Something went wrong when adding movie:', err));
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        setMovies(movies.filter((movie) => movie.id !== id));
      })
      .catch((err) => console.error('Something went wrong when deleting movie:', err));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          MCU Movie <span className={styles.accent}>Tracker</span>
        </h1>
        <p className={styles.subtitle}>
          Keep track of movies, actors and the characters they play
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={`${styles.input} ${styles.yearInput}`}
          type="number"
          placeholder="Release year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button className={styles.addButton} type="submit">
          Add movie
        </button>
      </form>

      <div className={styles.sectionTitle}>
        <h2>All movies</h2>
        <span className={styles.count}>({movies.length})</span>
      </div>

      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default MovieList;