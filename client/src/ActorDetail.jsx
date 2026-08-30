import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ActorDetail() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/actors/${id}`)
      .then((res) => res.json())
      .then((data) => setActor(data))
      .catch((err) =>
        console.error("Something went wrong fetching actor:", err),
      );
  }, [id]);

  if (!actor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">&larr; Back to movies</Link>
      <h1>{actor.name}</h1>

      {actor.imdb_url ? (
        <p>
          <a href={actor.imdb_url} target="_blank" rel="noopener noreferrer">
            View on IMDb
          </a>
        </p>
      ) : (
        <p>No IMDb link added yet.</p>
      )}

      <h2>Movies</h2>
      <ul>
        {actor.movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link> as{" "}
            {movie.character_name} ({movie.releaseYear})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActorDetail;
