import React, { useEffect, useRef, useState } from "react";
import { logOut } from "../redux/reducers/authSlice";
import { cleanPackage } from "../redux/reducers/packageReducer";
import { setModalState } from "../redux/reducers/modalReducer";
import { setEditPage } from "../redux/reducers/editPageReducer";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";
import { menu } from "../assets/menuAssets/menuIcons";
import { useRedux } from "../constants/reduxImports";
import { clearMessages } from "../redux/reducers/messageReducer";
import { cleanContactLists } from "../redux/reducers/contactListReducer";

const Header = () => {
  const { currentModalState, dispatch, currentUser, currentFormState } =
    useRedux();
  const [clickedPath, setClickedPath] = useState();

  const [activeNav, setActiveNav] = useState("Home");
  const isDirtyRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {}, [activeNav]);

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
    dispatch(cleanPackage());
    dispatch(clearMessages());
    dispatch(cleanContactLists());
    dispatch(clearMessages());
    localStorage.removeItem("refreshToken");
  };

  const handleNavigate = (e) => {
    const path = e.currentTarget.getAttribute("href");
    setActiveNav(e.target.value);

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

  const detectActiveNav = (title) => {
    setActiveNav(title);
  };

  return (
    <div
      className={`flex flex-column items-center relative p-1 text-white bg-darkBlue rounded-full ml-3 mt-3 mb-3`}
    >
      <ul id="navList" className="flex flex-column my-auto">
        {menu?.map((Menu, index) => (
          <Link
            key={index}
            onClick={(e) => handleNavigate(e) || detectActiveNav(Menu.title)}
            to={`${
              Menu.title === "Account"
                ? Menu.location + currentUser
                : Menu.location
            }`}
            value={`${Menu.title}`}
            className={`flex flex-row rounded-md p-2 cursor-pointer `}
          >
            <div
              className={`flex flex-row gap-2 rounded-md p-2 hover:bg-darkestGray ${
                activeNav === Menu.title ? "bg-white text-black" : ""
              } text-gray-300 xl:text-sm text-xs items-center gap-x-3 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              {Menu.element}
            </div>
          </Link>
        ))}
      </ul>

      <Link
        onClick={handleLogout}
        className="flex rounded-md mr-3 p-2 cursor-pointer xl:w-12 w-10 hover:bg-light-white text-gray-300 xl:text-sm text-xs items-center gap-x-3"
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 rotate-90 ml-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
            />
          </svg>
        </div>
      </Link>
      <ModalComponent
        confirmLeave={handleConfirmNavigation}
        showModal={currentModalState}
      ></ModalComponent>
    </div>
  );
};

export default Header;
