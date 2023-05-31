import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { selectFormState, setState } from "../features/modal/formReducer";
import {
  setModalState,
  selectModalState,
} from "../features/modal/modalReducer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";

const Header = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isDirtyState = useSelector(selectFormState);
  const showModal = useSelector(selectModalState);
  const location = useLocation();
  const isDirtyRef = useRef(false);
  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logOut(user, token));
  const navigate = useNavigate();
  useEffect(() => {
    if (isDirtyState) {
      isDirtyRef.current = true;
    } else {
      isDirtyRef.current = false;
    }
  }, [isDirtyState, showModal]);

  useEffect(() => {
    const unblock = () => {
      if (isDirtyRef.current) {
        dispatch(setModalState({ show: true }));
        return false; // Block navigation
      }
    };

    window.onbeforeunload = unblock;

    return () => {
      window.onbeforeunload = null;
    };
  }, [dispatch]);

  const handleNavigate = (e) => {
    if (isDirtyRef.current) {
      dispatch(setModalState({ show: true }));
      e.preventDefault(); // Prevent navigation
    } else {
      dispatch(setModalState({ show: false }));
      handleConfirmNavigation(e.target.pathname); // Pass the clicked path
    }
  };
  const handleConfirmNavigation = (path) => {
    dispatch(setModalState({ show: false }));
    navigate(location.pathname);
    console.log(location.pathname); // Navigate after confirmation
  };

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
          <Link
            onClick={handleNavigate}
            className="nav-link text-white"
            aria-current="page"
            to="/home"
          >
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
              onClick={handleNavigate}
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
      <ModalComponent
        confirmLeave={handleConfirmNavigation}
        showModal={showModal}
      ></ModalComponent>
    </div>
  );
};

export default Header;
