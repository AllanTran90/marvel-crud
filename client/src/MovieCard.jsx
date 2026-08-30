import { Link } from 'react-router-dom';

function MovieCard({ movie, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(movie.id);
  };

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <h3>{movie.title}</h3>
      <p>{movie.releaseYear}</p>
      <button onClick={handleDeleteClick}>Delete</button>
    </Link>
  );
}

export default MovieCard;