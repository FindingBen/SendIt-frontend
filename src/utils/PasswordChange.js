import React, { useEffect, useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

const PasswordChange = ({ status, errStatus }) => {
  const [newPass, setNewPass] = useState();
  const [reNewPass, setReNewPass] = useState();
  const [isLoading, setIsLoading] = useState();
  const [oldPass, setOldPass] = useState();
  const token = useSelector(selectCurrentToken);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  const handleNewPass = (e) => {
    setNewPass(e.target.value);
  };

  const handleReNewPass = (e) => {
    setReNewPass(e.target.value);
  };

  const handleOldPass = (e) => {
    setOldPass(e.target.value);
  };

  let passChange = async () => {
    setIsLoading(true);
    try {
      if (newPass === reNewPass) {
        let response = await axiosInstance.post("/auth/users/set_password/", {
          new_password: newPass,
          re_new_password: reNewPass,
          current_password: oldPass,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        });
        if (response.status === 204) {
          status("Password changed!");
          setIsLoading(false);
          setNewPass("");
          setOldPass("");
          setReNewPass("");
        }
      } else {
        errStatus("Passwords must match!");
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { current_password, new_password } = error.response.data;

        if (
          current_password &&
          current_password[0] ===
            "This password is the same as your current password."
        ) {
          errStatus("New password cannot be the same as the old one!");
        } else if (
          new_password &&
          new_password[0] === "This password is too common."
        ) {
          errStatus("Please choose a stronger password.");
        } else {
          // Handle other error scenarios as needed
          errStatus("An error occurred while changing the password.");
        }
      } else {
        // Handle other types of errors
        errStatus("An unexpected error occurred.");
      }

      //errStatus(error.response.data.current_password);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 px-1">
      <div className="flex flex-col">
        <h3 class="xl:text-2xl text-xl text-left font-extralight text-white/50">
          Change password
        </h3>

        <div className="mt-3">
          <label className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white">
            Enter old password
          </label>
          <input
            type="password"
            className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-2 rounded duration-200"
            placeholder="Enter your old password"
            onChange={handleOldPass}
          ></input>
        </div>
        <div>
          <label className="block mt-1 text-sm text-left font-medium text-gray-300 dark:text-white">
            Enter new password
          </label>
          <input
            type="password"
            className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-2 rounded duration-200"
            placeholder="Enter your new password"
            onChange={handleNewPass}
          ></input>
        </div>
        <div>
          <label className="block mt-1 text-sm text-left font-medium text-gray-300 dark:text-white">
            Repeat new password
          </label>
          <input
            type="password"
            className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-2 rounded duration-200"
            placeholder="Re-enter your new password"
            onChange={handleReNewPass}
          ></input>
        </div>
      </div>

      <button
        className="flex items-start bg-sky-800 hover:bg-sky-400 text-white font-light py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4"
        onClick={passChange}
      >
        {isLoading ? (
          <p className="ml-1">Changing..</p>
        ) : (
          <p className="ml-1">Change</p>
        )}
      </button>
    </div>
  );
};

export default PasswordChange;
