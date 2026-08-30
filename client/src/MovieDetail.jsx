import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actorName, setActorName] = useState('');
  const [characterName, setCharacterName] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error('Something went wrong fetching movie:', err));
  }, [id]);

  const handleAddActor = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/api/movies/${id}/actors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: actorName, character_name: characterName }),
    })
      .then((res) => res.json())
      .then((newActor) => {
        setMovie({ ...movie, actors: [...movie.actors, newActor] });
        setActorName('');
        setCharacterName('');
      })
      .catch((err) => console.error('Something went wrong adding actor:', err));
  };

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

      <form onSubmit={handleAddActor}>
        <input
          type="text"
          placeholder="Actor name"
          value={actorName}
          onChange={(e) => setActorName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Character name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
        <button type="submit">Add actor</button>
      </form>
    </div>
  );
}

export default MovieDetail;