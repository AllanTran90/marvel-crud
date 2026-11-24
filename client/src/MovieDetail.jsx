import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Detail.module.css";
import { API_URL } from "./api";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actorName, setActorName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editYear, setEditYear] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) =>
        console.error("Something went wrong fetching movie:", err),
      );
  }, [id]);

  const handleAddActor = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/movies/${id}/actors`, {
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
    fetch(`${API_URL}/movies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, releaseYear: editYear }),
    })
      .then((res) => res.json())
      .then((updatedMovie) => {
        setMovie(updatedMovie);
        setIsEditing(false);
      })
      .catch((err) =>
        console.error("Something went wrong updating movie:", err),
      );
  };

  if (!movie) {
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
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              className={styles.input}
              type="number"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
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
            <h1>{movie.title}</h1>
            <div className={styles.meta}>
              <span className={styles.badge}>{movie.releaseYear}</span>
            </div>
            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.onHero}`}
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>Actors</h2>
          <span className={styles.count}>({movie.actors.length})</span>
        </div>

        {movie.actors.length === 0 ? (
          <p className={styles.empty}>No actors added yet.</p>
        ) : (
          <ul className={styles.list}>
            {movie.actors.map((actor) => (
              <li key={actor.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <Link to={`/actors/${actor.id}`} className={styles.itemTitle}>
                    {actor.name}
                  </Link>
                  <span className={styles.itemSub}>
                    as {actor.character_name}
                  </span>
                </div>
                {actor.imdb_url && (
                  <a
                    className={styles.itemExtra}
                    href={actor.imdb_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IMDb
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <form className={styles.form} onSubmit={handleAddActor}>
          <input
            className={styles.input}
            type="text"
            placeholder="Actor name"
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <button className={`${styles.button} ${styles.primary}`} type="submit">
            Add actor
          </button>
        </form>
      </section>
    </div>
  );
}

export default MovieDetail;
