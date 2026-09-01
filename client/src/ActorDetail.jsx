import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ActorDetail() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImdbUrl, setEditImdbUrl] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/api/actors/${id}`)
      .then((res) => res.json())
      .then((data) => setActor(data))
      .catch((err) =>
        console.error("Something went wrong fetching actor:", err),
      );
  }, [id]);

  const handleEditClick = () => {
    setEditName(actor.name);
    setEditImdbUrl(actor.imdb_url || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    fetch(`http://localhost:3001/api/actors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, imdb_url: editImdbUrl }),
    })
      .then((res) => res.json())
      .then((updatedActor) => {
        setActor(updatedActor);
        setIsEditing(false);
      })
      .catch((err) =>
        console.error("Something went wrong updating actor:", err),
      );
  };

  const handleDelete = () => {
    fetch(`http://localhost:3001/api/actors/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Skådespelaren är borta, så vi kan inte stanna kvar på den här sidan
        window.location.href = "/";
      })
      .catch((err) =>
        console.error("Something went wrong deleting actor:", err),
      );
  };

  if (!actor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">&larr; Back to movies</Link>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            type="text"
            value={editImdbUrl}
            onChange={(e) => setEditImdbUrl(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancell</button>
        </div>
      ) : (
        <div>
          <h1>{actor.name}</h1>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDelete}>Delete</button>

          {actor.imdb_url ? (
            <p>
              <a
                href={actor.imdb_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on IMDb
              </a>
            </p>
          ) : (
            <p>No IMDb link added yet.</p>
          )}
        </div>
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
