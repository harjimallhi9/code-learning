import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-brand">
        <Link to="/">Movie App</Link>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
      </div>
    </div>
  );
};

export default Navbar;
