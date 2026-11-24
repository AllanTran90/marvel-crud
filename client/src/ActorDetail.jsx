import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Detail.module.css";
import { API_URL } from "./api";

function ActorDetail() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImdbUrl, setEditImdbUrl] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/actors/${id}`)
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
    fetch(`${API_URL}/actors/${id}`, {
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
    fetch(`${API_URL}/actors/${id}`, {
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
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        &larr; Back to movies
      </Link>

      <section className={styles.hero}>
        {isEditing ? (
          <div className={styles.editForm}>
            <input
              className={styles.input}
              type="text"
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="IMDb URL"
              value={editImdbUrl}
              onChange={(e) => setEditImdbUrl(e.target.value)}
            />
            <button
              className={`${styles.button} ${styles.onHero}`}
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className={`${styles.button} ${styles.ghost}`}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h1>{actor.name}</h1>
            <div className={styles.meta}>
              {actor.imdb_url ? (
                <a
                  className={styles.heroLink}
                  href={actor.imdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on IMDb &rarr;
                </a>
              ) : (
                <span className={styles.muted}>No IMDb link added yet.</span>
              )}
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.onHero}`}
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className={`${styles.button} ${styles.ghost}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>Movies</h2>
          <span className={styles.count}>({actor.movies.length})</span>
        </div>

        <ul className={styles.list}>
          {actor.movies.map((movie) => (
            <li key={movie.id} className={styles.item}>
              <div className={styles.itemMain}>
                <Link to={`/movies/${movie.id}`} className={styles.itemTitle}>
                  {movie.title}
                </Link>
                <span className={styles.itemSub}>
                  as {movie.character_name}
                </span>
              </div>
              <span className={styles.itemExtra}>{movie.releaseYear}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ActorDetail;
