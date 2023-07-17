import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { selectFormState } from "../features/modal/formReducer";
import {
  setModalState,
  selectModalState,
} from "../features/modal/modalReducer";
import { setEditPage } from "../features/elements/editPageReducer";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";
import { useState } from "react";

const Header = () => {
  const [clickedPath, setClickedPath] = useState();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isDirtyState = useSelector(selectFormState);
  const showModal = useSelector(selectModalState);
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
  }, []);

  const handleNavigate = (e) => {
    const path = e.currentTarget.getAttribute("href");

    setClickedPath(path);
    console.log(path);
    if (isDirtyRef.current) {
      dispatch(setModalState({ show: true }));
      e.preventDefault(); // Prevent navigation
    } else {
      dispatch(setModalState({ show: false }));
      handleConfirmNavigation(path);
      // Pass the clicked path
    }
  };
  const handleConfirmNavigation = () => {
    dispatch(setModalState({ show: false }));
    console.log(clickedPath);
    navigate(clickedPath);
    setClickedPath("");
    dispatch(setEditPage({ isEditFormDirty: false }));
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ height: "100vh" }}
    >
      <a href="/" className="d-flex align-items-center mb-4 text-white">
        <svg className="bi me-2" width="40" height="32"></svg>
        <svg fill="none" viewBox="0 0 60 60" className="w-30 h-30">
          <image
            xlinkHref={require("../assets/IMG_2445.jpg")}
            x="0"
            y="7"
            width="50"
            height="50"
          />
          <path strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="mb-3">
          <Link
            onClick={(e) => handleNavigate(e)}
            to="/home"
            className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>

            <span className="ml-7">Home</span>
          </Link>
        </li>
        {user ? (
          <li className="mb-3">
            <Link
              to="/create_note/"
              className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span className="ml-7">Create Content</span>
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li className="mb-3">
            <Link
              onClick={(e) => handleNavigate(e)}
              to="/contact_lists/"
              className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>

              <span className="ml-7">Contact lists</span>
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li className="mb-3">
            <Link
              onClick={(e) => handleNavigate(e)}
              to="/package_plan/"
              className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>

              <span className="ml-7">Package plan</span>
            </Link>
          </li>
        ) : (
          <li></li>
        )}
        {user ? (
          <li className="mb-3">
            <hr></hr>
            <h3
              className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-700"
              aria-current="page"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>

              <span className="ml-7">Logout</span>
            </h3>
          </li>
        ) : (
          <li></li>
        )}
      </ul>
      <hr />
      <Link
        to={`/account_settings/${user}/`}
        onClick={(e) => handleNavigate(e)}
        className="flex items-center p-2 text-white-900 rounded-lg dark:text-white hover:bg-indigo-400 dark:hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="ml-7">Account</span>
      </Link>
      <ModalComponent
        confirmLeave={handleConfirmNavigation}
        showModal={showModal}
      ></ModalComponent>
    </div>
  );
};

export default Header;
