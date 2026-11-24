import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import ErrorMessage from './ErrorMessage';
import styles from './MovieList.module.css';
import { apiFetch } from './api';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/movies')
      .then((data) => setMovies(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    apiFetch('/movies', {
      method: 'POST',
      body: { title, releaseYear },
    })
      .then((newMovie) => {
        // Funktionsvarianten av setState använder alltid senaste listan
        setMovies((prev) => [...prev, newMovie]);
        setTitle('');
        setReleaseYear('');
      })
      .catch((err) => setError(err.message));
  };

  const handleDelete = (movie) => {
    if (!window.confirm(`Delete "${movie.title}"? This cannot be undone.`)) {
      return;
    }
    setError('');

    apiFetch(`/movies/${movie.id}`, { method: 'DELETE' })
      .then(() => {
        setMovies((prev) => prev.filter((m) => m.id !== movie.id));
      })
      .catch((err) => setError(err.message));
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
        {/* required/min/max ger snabb feedback i webbläsaren.
            Servern validerar ändå, eftersom det här går att kringgå. */}
        <input
          className={styles.input}
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className={`${styles.input} ${styles.yearInput}`}
          type="number"
          placeholder="Release year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          min="1900"
          max="2100"
          required
        />
        <button className={styles.addButton} type="submit">
          Add movie
        </button>
      </form>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div className={styles.sectionTitle}>
        <h2>All movies</h2>
        {!isLoading && <span className={styles.count}>({movies.length})</span>}
      </div>

      {isLoading ? (
        <p className={styles.status}>Loading movies...</p>
      ) : movies.length === 0 ? (
        !error && (
          <p className={styles.status}>No movies yet. Add one above!</p>
        )
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;
