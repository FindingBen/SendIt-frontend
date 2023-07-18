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
    let response = await axiosInstance.post(
      "http://localhost:8000/auth/users/set_password/",
      {
        new_password: newPass,
        re_new_password: reNewPass,
        current_password: oldPass,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    console.log(response);
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <h1 className="text-2xl font-bold mb-4">Change your password</h1>
            <hr></hr>
          </div>
          <div className="row">
            <div>
              <input
                type="password"
                className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
                placeholder="Enter your new password"
                onChange={handleNewPass}
              ></input>
              <input
                type="password"
                className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
                placeholder="Re-enter your new password"
                onChange={handleReNewPass}
              ></input>
              <input
                type="password"
                className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
                placeholder="Enter your old password"
                onChange={handleOldPass}
              ></input>
              <button
                className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
                onClick={passChange}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordChange;
