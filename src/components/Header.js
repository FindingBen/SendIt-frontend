import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
      <a
        href="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg class="bi me-2" width="40" height="32"></svg>
        <span class="fs-4">SendIt</span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li>
          <Link className="nav-link" aria-current="page" to="/">
            Home
          </Link>
        </li>
        {user ? (
          <li>
            <Link className="nav-link" aria-current="page" to="/create_note">
              Create note
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li>
            <Link className="nav-link" aria-current="page" to="/contact_lists/">
              Contact lists
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li class="nav-item">
            <h3 className="nav-link" aria-current="page" onClick={logoutUser}>
              Logout
            </h3>
          </li>
        ) : (
          <li></li>
        )}
      </ul>
      <hr />
      <div class="dropdown">
        <img
          src="https://github.com/mdo.png"
          alt=""
          width="32"
          height="32"
          class="rounded-circle me-2"
        />
        <strong>{user ? user.username : <li></li>}</strong>
      </div>
    </div>
  );
};

export default Header;
