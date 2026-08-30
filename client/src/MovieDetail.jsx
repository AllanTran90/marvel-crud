import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error('Something went wrong fetching movie:', err));
  }, [id]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">&larr; Back to movies</Link>
      <h1>{movie.title}</h1>
      <p>{movie.releaseYear}</p>

      <h2>Actors</h2>
      {movie.actors.length === 0 ? (
        <p>No actors added yet.</p>
      ) : (
        <ul>
          {movie.actors.map((actor) => (
            <li key={actor.id}>
              {actor.name} as {actor.character_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieDetail;