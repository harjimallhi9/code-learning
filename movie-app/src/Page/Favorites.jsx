import React from "react";
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

const Favorites = () => {

  const { favorites } = useMovieContext();

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No favorite movies yet</h2>
        <p>Add some movies to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Favorite Movies</h2>

      <div className="movie-grid">
        {favorites.map((Movie) => (
          <MovieCard Movie={Movie} key={Movie.id} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;