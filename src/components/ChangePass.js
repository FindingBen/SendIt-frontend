import React, { useEffect, useState, memo } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";

const ChangePass = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const params = useParams();
  const navigate = useNavigate();

  const handleOldPass = (e) => setOldPassword(e.target.value);

  const handleNewPass = (e) => setNewPassword(e.target.value);

  let changePass = async () => {
    const formData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      let response = await axiosInstance.put(
        "http://127.0.0.1:8000/api/change_password/",
        formData,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      console.log(formData);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100"></div>
        <div className="row">
          <h2 className="text-2xl font-bold mb-4 mt-4">Change password</h2>
          <input
            className="bg-gray-800 hover:bg-green-400 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            type="password"
            onChange={handleOldPass}
            placeholder="Enter old password"
          />
          <input
            className="bg-gray-800 hover:bg-green-400 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            type="password"
            onChange={handleNewPass}
            placeholder="Enter new password"
          />
          <button
            style={{ marginLeft: "38%" }}
            className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
            onClick={changePass}
          >
            Update
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(ChangePass);
