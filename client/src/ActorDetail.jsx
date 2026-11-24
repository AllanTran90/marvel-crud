import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import styles from "./Detail.module.css";
import { apiFetch } from "./api";

function ActorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actor, setActor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImdbUrl, setEditImdbUrl] = useState("");
  // loadError: sidan kunde inte laddas alls (t.ex. skådespelaren finns inte)
  // error: en enskild åtgärd misslyckades (t.ex. spara), sidan visas ändå
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/actors/${id}`)
      .then((data) => setActor(data))
      .catch((err) => setLoadError(err.message));
  }, [id]);

  const handleEditClick = () => {
    setEditName(actor.name);
    setEditImdbUrl(actor.imdb_url || "");
    setError("");
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setError("");

    apiFetch(`/actors/${id}`, {
      method: "PUT",
      body: { name: editName, imdb_url: editImdbUrl },
    })
      .then((updatedActor) => {
        setActor(updatedActor);
        setIsEditing(false);
      })
      .catch((err) => setError(err.message)); // stanna kvar i redigeringsläget
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete ${actor.name}? This cannot be undone.`)) {
      return;
    }
    setError("");

    apiFetch(`/actors/${id}`, { method: "DELETE" })
      // Skådespelaren är borta, så vi går tillbaka till startsidan.
      // navigate byter sida inom React utan att ladda om hela appen.
      .then(() => navigate("/"))
      .catch((err) => setError(err.message));
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

  if (!actor) {
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
              placeholder="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              aria-label="Name"
              required
            />
            <input
              className={styles.input}
              type="url"
              placeholder="IMDb URL"
              value={editImdbUrl}
              onChange={(e) => setEditImdbUrl(e.target.value)}
              aria-label="IMDb URL"
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
                type="button"
                className={`${styles.button} ${styles.onHero}`}
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.ghost}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </section>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <section className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2>Movies</h2>
          <span className={styles.count}>({actor.movies.length})</span>
        </div>

        {actor.movies.length === 0 ? (
          <p className={styles.empty}>Not in any movies yet.</p>
        ) : (
          <ul className={styles.list}>
            {actor.movies.map((movie) => (
              <li key={movie.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <Link to={`/movies/${movie.id}`} className={styles.itemTitle}>
                    {movie.title}
                  </Link>
                  {movie.character_name && (
                    <span className={styles.itemSub}>
                      as {movie.character_name}
                    </span>
                  )}
                </div>
                <span className={styles.itemExtra}>{movie.releaseYear}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ActorDetail;
