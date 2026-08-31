import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actorName, setActorName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editYear, setEditYear] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) =>
        console.error("Something went wrong fetching movie:", err),
      );
  }, [id]);

  const handleAddActor = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/api/movies/${id}/actors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: actorName, character_name: characterName }),
    })
      .then((res) => res.json())
      .then((newActor) => {
        setMovie({ ...movie, actors: [...movie.actors, newActor] });
        setActorName("");
        setCharacterName("");
      })
      .catch((err) => console.error("Something went wrong adding actor:", err));
  };

  const handleEditClick = () => {
    setEditTitle(movie.title);
    setEditYear(movie.releaseYear);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
  fetch(`http://localhost:3001/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: editTitle, releaseYear: editYear }),
  })
    .then((res) => res.json())
    .then((updatedMovie) => {
      setMovie(updatedMovie);
      setIsEditing(false);
    })
    .catch((err) => console.error("Something went wrong updating movie:", err));
};

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">&larr; Back to movies</Link>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="number"
            value={editYear}
            onChange={(e) => setEditYear(e.target.value)}
          />

          <button onClick={handleSaveEdit}>Spara</button>
          <button onClick={() => setIsEditing(false)}>Avbryt</button>
        </div>
      ) : (
        <div>
          <h1>{movie.title}</h1>
          <p>{movie.releaseYear}</p>
          <button onClick={handleEditClick}>Redigera</button>
        </div>
      )}

      <h2>Actors</h2>
      {movie.actors.length === 0 ? (
        <p>No actors added yet.</p>
      ) : (
        <ul>
          {movie.actors.map((actor) => (
            <li key={actor.id}>
              <Link to={`/actors/${actor.id}`}>{actor.name}</Link> as{" "}
              {actor.character_name}
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
