import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

// Knappen ligger BREDVID länken, inte inuti den.
// En <button> inuti en <a> är ogiltig HTML: klicket går till båda,
// så man navigerar till detaljsidan samtidigt som filmen raderas.
function MovieCard({ movie, onDelete }) {
  return (
    <article className={styles.movieCard}>
      <Link to={`/movies/${movie.id}`} className={styles.link}>
        <div className={styles.poster}>
          <span className={styles.year}>{movie.releaseYear}</span>
        </div>
        <h3 className={styles.title}>{movie.title}</h3>
      </Link>
      <button
        type="button"
        className={styles.deleteButton}
        onClick={() => onDelete(movie)}
      >
        Delete
      </button>
    </article>
  );
}

export default MovieCard;
