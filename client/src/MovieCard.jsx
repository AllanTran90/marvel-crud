import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

function MovieCard({ movie, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(movie.id);
  };

  return (
    <Link to={`/movies/${movie.id}`} className={styles.movieCard}>
      <h3>{movie.title}</h3>
      <p>{movie.releaseYear}</p>
      <button onClick={handleDeleteClick}>Delete</button>
    </Link>
  );
}

export default MovieCard;