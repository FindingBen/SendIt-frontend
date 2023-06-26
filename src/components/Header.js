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
  }, [dispatch]);

  const handleNavigate = (e) => {
    const clickedPath = e.target.pathname;
    setClickedPath(clickedPath);
    console.log(clickedPath);
    if (isDirtyRef.current) {
      dispatch(setModalState({ show: true }));
      e.preventDefault(); // Prevent navigation
    } else {
      dispatch(setModalState({ show: false }));
      //handleConfirmNavigation(clickedPath);
      // Pass the clicked path
    }
  };
  const handleConfirmNavigation = (e) => {
    dispatch(setModalState({ show: false }));
    navigate(clickedPath);
  };

  return (
    
    //   <nav
    //   id="sidenav-3"
    //   class="fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full overflow-hidden bg-zinc-800 shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0"
    //   data-te-sidenav-init
    //   data-te-sidenav-hidden="false"
    //   data-te-sidenav-color="white">
    //   <ul class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
    //     <li class="relative">
          
    //     </li>
    //     <li class="relative">
    //     <Link
    //         onClick={handleNavigate}
    //         className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
    //         aria-current="page"
    //         to="/home"
    //       >
    //         Home
    //       </Link>
         
    //     </li>
    //          {user ? (
    //       <li>
    //         <Link
    //           className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
    //           aria-current="page"
    //           to="/create_note"
    //         >
    //           Create Content
    //         </Link>
    //       </li>
    //     ) : (
    //       <li></li>
    //     )}
    //     {user ? (
    //       <li className="nav-item">
    //         <Link
    //           onClick={handleNavigate}
    //           className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
    //           aria-current="page"
    //           to="/contact_lists/"
    //         >
    //           Contact lists
    //         </Link>
    //       </li>
    //     ) : (
    //       <li></li>
    //     )}
    //     {user ? (
    //       <li class="nav-item">
    //         <h3
    //           className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
    //           aria-current="page"
    //           onClick={handleLogout}
    //         >
    //           Logout
    //         </h3>
    //       </li>
    //     ) : (
    //       <li></li>
    //     )}
    //   </ul>
    // </nav>
 

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
            className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
            aria-current="page"
            to="/home"
          >
            Home
          </Link>
        </li>
        {user ? (
          <li>
            <Link
              className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
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
          <li>
            <Link
              onClick={handleNavigate}
              className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
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
              className="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-300 outline-none transition duration-300 ease-linear hover:bg-white/10 hover:outline-none focus:bg-white/10 focus:outline-none active:bg-white/10 active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
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
