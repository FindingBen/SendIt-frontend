import React, { useEffect, useRef, useState } from "react";
import { setModalState } from "../redux/reducers/modalReducer";
import { setEditPage } from "../redux/reducers/editPageReducer";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";
import { menu } from "../assets/menuAssets/menuIcons";
import { useRedux } from "../constants/reduxImports";
const Header = () => {
  const { currentModalState, dispatch, currentFormState } = useRedux();
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

  const handleNavigate = (e, menuTitle) => {
    const path = e.currentTarget.getAttribute("href");
    setActiveNav(menuTitle);
    setClickedPath(path);

    if (isDirtyRef.current) {
      dispatch(setModalState({ show: true }));
      e.preventDefault(); // Prevent navigation
    } else {
      dispatch(setModalState({ show: false }));
      handleConfirmNavigation(path);
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
      className={`flex flex-column items-center w-44 fixed top-0 left-0 p-1 text-white bg-navBlue border-r-2 border-gray-800 h-screen overflow-y-auto`}
    >
      <ul id="navList" className="flex flex-column my-auto">
        {menu?.map((Menu, index) => (
          <Link
            key={index}
            to={Menu.location}
            onClick={(e) => handleNavigate(e, Menu.title)}
            className={`flex flex-row rounded-md p-2 cursor-pointer `}
          >
            <div
              className={`flex flex-row gap-2 rounded-md p-2 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 ${
                activeNav === Menu.title ? "bg-white text-black" : ""
              } text-gray-300 xl:text-sm text-xs items-center gap-x-3 
        ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"} `}
            >
              <span>{Menu.element}</span>
              <span>{Menu.title}</span>
            </div>
          </Link>
        ))}
      </ul>

      <ModalComponent
        confirmLeave={handleConfirmNavigation}
        showModal={currentModalState}
      ></ModalComponent>
    </div>
  );
};

export default Header;
