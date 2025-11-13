import React, { useEffect, useRef, useState } from "react";
import { setModalState } from "../redux/reducers/modalReducer";
import { setEditPage } from "../redux/reducers/editPageReducer";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../components/ModalComponent";
import { menu } from "../assets/menuAssets/menuIcons";
import { useRedux } from "../constants/reduxImports";

const Header = () => {
  const { currentModalState, dispatch, currentFormState, currentShopifyToken } = useRedux();
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
  className="flex flex-col items-center w-52 fixed top-0 left-0 py-4 bg-[#0D1320] h-screen border-r border-[#1C2437]/40 text-white shadow-[4px_0_16px_rgba(0,0,0,0.3)]"
>
  <ul id="navList" className="flex flex-col gap-2 mt-40 w-full px-3">
    {menu?.map((Menu, index) => {
      // Skip Shopify menu if no token
      if (Menu.location?.includes("products_shopify") && !currentShopifyToken) {
        return null;
      }

      const isActive = activeNav === Menu.title;

      return (
        <Link
          key={index}
          to={Menu.location}
          onClick={(e) => handleNavigate(e, Menu.title)}
          className="w-full"
        >
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white shadow-[0_0_14px_rgba(62,111,244,0.35)]"
                  : "text-gray-400 hover:bg-[#1B2233] hover:text-gray-100 hover:shadow-[0_0_12px_rgba(62,111,244,0.15)]"
              }
              ${Menu.gap ? "mt-6" : ""}
            `}
          >
            <span className="text-lg">{Menu.element}</span>
            <span className="text-sm font-medium tracking-wide">
              {Menu.title}
            </span>
          </div>
        </Link>
      );
    })}
  </ul>

  {/* Modal (confirm navigation) */}
  <ModalComponent
    confirmLeave={handleConfirmNavigation}
    showModal={currentModalState}
  />
</div>

  );
};

export default Header;
