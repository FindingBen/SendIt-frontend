import React, { useEffect, useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

const PasswordChange = () => {
  const [sent, setSent] = useState(false);
  const [newPass, setNewPass] = useState();
  const [reNewPass, setReNewPass] = useState();
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
    let response = await axiosInstance.post("/auth/users/set_password/", {
      new_password: newPass,
      re_new_password: reNewPass,
      current_password: oldPass,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
    });
    console.log(response);
  };

  return (
    <div className="flex-1 px-1 xl:px-2 sm:px-0">
      <div className="flex-col">
        <h3 class="text-2xl text-left font-extralight text-white/50">
          Change password
        </h3>

        <div className="mt-3">
          <label className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white">
            Enter old password
          </label>
          <input
            type="password"
            className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-2 rounded w-100 h-2/5 xl:h-full"
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
            className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100 h-2/5"
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
            className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100 h-2/5"
            placeholder="Re-enter your new password"
            onChange={handleReNewPass}
          ></input>
        </div>
      </div>
      <button
        style={{ marginRight: "80%" }}
        className="bg-sky-800 left hover:bg-sky-400 mt-3 text-white font-light py-2 px-4 rounded w-32"
        onClick={passChange}
      >
        Change
      </button>
    </div>
  );
};

export default PasswordChange;
