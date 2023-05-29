import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";

const Header = () => {
  // let { user, logoutUser } = useContext(AuthContext);
  const [userData, setUser] = useState(null);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logOut(user, token));

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg className="bi me-2" width="40" height="32"></svg>
        <span className="fs-4">SendIt</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link className="nav-link text-white" aria-current="page" to="/home">
            Home
          </Link>
        </li>
        {user ? (
          <li>
            <Link
              className="nav-link text-white"
              aria-current="page"
              to="/create_note"
            >
              Create note
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              aria-current="page"
              to="/contact_lists/"
            >
              Contact lists
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li class="nav-item">
            <h3
              className="nav-link text-white"
              aria-current="page"
              onClick={handleLogout}
            >
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
      </div>
    </div>
  );
};

export default Header;
