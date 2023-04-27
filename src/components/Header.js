import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    // <nav class="navbar navbar-expand-lg navbar-light bg-dark">
    //   <Link className="nav-item" to="/">
    //     Home
    //   </Link>
    //   <span>#</span>
    //   {user ? (
    //     <p onClick={logoutUser}>Logout</p>
    //   ) : (
    //     <Link className="nav-item" to="/login">
    //       Login
    //     </Link>
    //   )}
    //   <Link className="nav-item" to="/register">
    //     Register
    //   </Link>
    //   <Link className="nav-item" to="/create_note">
    //     Create note
    //   </Link>
    // </nav>
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-white">
        <div class="container-fluid">
          {/* <button
        class="navbar-toggler"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#navbarExample01"
        aria-controls="navbarExample01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-bars"></i>
      </button> */}
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item active">
                <Link className="nav-link" aria-current="page" to="*">
                  Home
                </Link>
              </li>
              {!user ? (
                <li class="nav-item">
                  <Link className="nav-link" aria-current="page" to="/login">
                    Login
                  </Link>
                </li>
              ) : (
                <li></li>
              )}

              {!user ? (
                <li class="nav-item">
                  <Link className="nav-link" aria-current="page" to="/register">
                    Register
                  </Link>
                </li>
              ) : (
                <li></li>
              )}

              {user ? (
                <li class="nav-item">
                  <Link
                    className="nav-link"
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
                <li class="nav-item">
                  <h3
                    className="nav-link"
                    aria-current="page"
                    onClick={logoutUser}
                  >
                    Logout
                  </h3>
                </li>
              ) : (
                <li></li>
              )}
              {user ? (
                <li class="nav-item">
                  <Link
                    className="nav-link"
                    aria-current="page"
                    to="/contact_lists/"
                  >
                    Contact lists
                  </Link>
                </li>
              ) : (
                <li></li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
