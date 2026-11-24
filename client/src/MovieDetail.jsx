import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import styles from "./Detail.module.css";
import { apiFetch } from "./api";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actorName, setActorName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editYear, setEditYear] = useState("");
  // loadError: sidan kunde inte laddas alls (t.ex. filmen finns inte)
  // error: en enskild åtgärd misslyckades (t.ex. spara), sidan visas ändå
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/movies/${id}`)
      .then((data) => setMovie(data))
      .catch((err) => setLoadError(err.message));
  }, [id]);

  const handleAddActor = (e) => {
    e.preventDefault();
    setError("");

    apiFetch(`/movies/${id}/actors`, {
      method: "POST",
      body: { name: actorName, character_name: characterName },
    })
      .then((newActor) => {
        setMovie((prev) => ({ ...prev, actors: [...prev.actors, newActor] }));
        setActorName("");
        setCharacterName("");
      })
      .catch((err) => setError(err.message));
  };

  const handleEditClick = () => {
    setEditTitle(movie.title);
    setEditYear(movie.releaseYear);
    setError("");
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setError("");

    apiFetch(`/movies/${id}`, {
      method: "PUT",
      body: { title: editTitle, releaseYear: editYear },
    })
      .then((updatedMovie) => {
        setMovie(updatedMovie);
        setIsEditing(false);
      })
      .catch((err) => setError(err.message)); // stanna kvar i redigeringsläget
  };

  const backLink = (
    <Link to="/" className={styles.backLink}>
      &larr; Back to movies
    </Link>
  );

  if (loadError) {
    return (
      <div className={styles.page}>
        {backLink}
        <ErrorMessage message={loadError} />
      </div>
    );
  }

  if (!movie) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.page}>
      {backLink}

      <section className={styles.hero}>
        {isEditing ? (
          <form className={styles.editForm} onSubmit={handleSaveEdit}>
            <input
              className={styles.input}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              aria-label="Title"
              required
            />
            <input
              className={styles.input}
              type="number"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
              aria-label="Release year"
              min="1900"
              max="2100"
              required
            />
            <button
              type="submit"
              className={`${styles.button} ${styles.onHero}`}
            >
              Save
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.ghost}`}
              onClick={() => {
                setIsEditing(false);
                setError("");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1>{movie.title}</h1>
            <div className={styles.meta}>
              <span className={styles.badge}>{movie.releaseYear}</span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.button} ${styles.onHero}`}
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </section>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

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
                  {actor.character_name && (
                    <span className={styles.itemSub}>
                      as {actor.character_name}
                    </span>
                  )}
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
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Character name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
          <button
            className={`${styles.button} ${styles.primary}`}
            type="submit"
          >
            Add actor
          </button>
        </form>
      </section>
    </div>
  );
}

export default MovieDetail;
