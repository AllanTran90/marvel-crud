import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

function MovieCard({ movie, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(movie.id);
  };

  return (
    <Link to={`/movies/${movie.id}`} className={styles.movieCard}>
      <div className={styles.poster}>
        <span className={styles.year}>{movie.releaseYear}</span>
      </div>
      <div className={styles.body}>
        <h3>{movie.title}</h3>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
    </Link>
  );
}

export default MovieCard;
