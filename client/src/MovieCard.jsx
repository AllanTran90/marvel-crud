
function MovieCard({movie, onDelete}) {
    return(
        <div className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.releaseYear}</p>
            <button onClick={() => onDelete(movie.id)}>Delete</button>
        </div>
    );
}
export default MovieCard;