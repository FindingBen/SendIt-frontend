import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { logOut } from "../redux/reducers/authSlice";
import { selectFormState } from "../redux/reducers/formReducer";
import { setModalState } from "../redux/reducers/modalReducer";
import { setEditPage } from "../redux/reducers/editPageReducer";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";
import "../css/Header.css";
import { useRedux } from "../constants/reduxImports";

const Header = () => {
  const { currentModalState, dispatch, currentUser, currentFormState } =
    useRedux();
  const [clickedPath, setClickedPath] = useState();
  const [open, setOpen] = useState(true);
  const isDirtyRef = useRef(false);

  const navigate = useNavigate();

  const Menus = [
    { title: "Home", src: "homeIcon", location: "/home" },
    { title: "Create", src: "create", location: "/create_note/" },
    { title: "Contacts", src: "contactList", location: "/contact_lists/" },
    { title: "Plan", src: "membership", location: "/package_plan/" },
    {
      title: "Account",
      src: "account",
      location: `/account_settings/${currentUser}`,
    },
  ];

  useEffect(() => {
    if (currentFormState) {
      isDirtyRef.current = true;
    } else {
      isDirtyRef.current = false;
    }
  }, [currentFormState, currentModalState]);

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

  const handleLogout = () => {
    dispatch(logOut());
    localStorage.removeItem("refreshToken");
  };

  const handleNavigate = (e) => {
    const path = e.currentTarget.getAttribute("href");

    setClickedPath(path);

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

    navigate(clickedPath);
    setClickedPath("");
    dispatch(setEditPage({ isEditFormDirty: false }));
  };

  return (
    <div
      className={`d-flex flex-column relative flex-shrink-0 p-3 duration-300 text-white bg-darkBlue text-xs xl:text-base rounded ml-3 mt-3 mb-3 xl:h-90vh ${
        open ? "w-36" : "w-16 flex items-center"
      } ${open ? "xl:w-46" : "xl:w-20"}`}
    >
      <div className="mx-auto mb-4 xl:mb-4 text-white">
        <img
          src={require("../assets/logoSpp.PNG")}
          className={`${open ? "w-20 xl:w-24" : "w-20"}`}
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        onClick={() => setOpen(!open)}
        class={`w-7 h-7 absolute cursor-pointer -right-2 top-9 ${
          !open && "rotate-180"
        }`}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <hr />
      <ul id="navList" className="nav nav-pills flex-column mb-auto">
        {Menus.map((Menu, index) => (
          <Link
            key={index}
            onClick={(e) => handleNavigate(e)}
            to={`${Menu.location}`}
            className={`flex  rounded-md p-2 cursor-pointer xl:w-12 w-10 hover:bg-light-white text-gray-300 xl:text-sm text-xs items-center gap-x-3 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
              index === 0 && "bg-light-white"
            } `}
          >
            <img src={require(`../assets/menuAssets/${Menu.src}.png`)} />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              {Menu.title}
            </span>
          </Link>
        ))}
      </ul>
      <Link
        onClick={handleLogout}
        className="flex rounded-md mr-3 p-2 cursor-pointer xl:w-12 w-10 hover:bg-light-white text-gray-300 xl:text-sm text-xs items-center gap-x-3"
      >
        <img src={require("../assets/menuAssets/exit.png")} />
        <span className={`${!open && "hidden"} origin-left duration-200`}>
          Logout
        </span>
      </Link>
      <ModalComponent
        confirmLeave={handleConfirmNavigation}
        showModal={currentModalState}
      ></ModalComponent>
    </div>
  );
};

export default Header;
