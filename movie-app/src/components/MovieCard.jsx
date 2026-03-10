import React from "react";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({ Movie }) {

  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();

  const favorite = isFavorite(Movie.id);

  function onFavoriteClick() {
    if (favorite) {
      removeFromFavorites(Movie.id);
    } else {
      addToFavorites(Movie);
    }
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${Movie.poster_path}`}
          alt={Movie.title}
        />
      </div>

      <div className="movie-overlay">
        <button className="favorite-btn" onClick={onFavoriteClick}>
          {favorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="movie-info">
        <h3>{Movie.title}</h3>
        <p>{Movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;