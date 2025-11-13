import React, { useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import Loader from "../components/LoaderSkeleton/Loader";

const PasswordChange = ({ user_obj }) => {
  const [newPass, setNewPass] = useState();
  const [reNewPass, setReNewPass] = useState();
  const [isLoading, setIsLoading] = useState();
  const [oldPass, setOldPass] = useState();
  const [errMsg, setErrMsg] = useState();
  const [msg, setMsg] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const axiosInstance = useAxiosInstance();

  const handleNewPass = (e) => {
    setNewPass(e.target.value);
  };

  const handleReNewPass = (e) => {
    setReNewPass(e.target.value);
  };

  const handleOldPass = (e) => {
    setOldPass(e.target.value);
  };

  setTimeout(() => setMsg(), 4000);
  setTimeout(() => setErrMsg(), 4000);

  let passChange = async () => {
    setIsLoading(true);
    const formData = {
      new_password: newPass,
      re_new_password: reNewPass,
      current_password: oldPass,
    };
    try {
      if (newPass === reNewPass) {
        let response = await axiosInstance.post(
          "/api/users/set_password/",
          formData
        );
        if (response.status === 204) {
          setMsg("Password changed!");
          setIsLoading(false);
          setNewPass("");
          setOldPass("");
          setReNewPass("");
          setIsEditing(false);
        }
      } else {
        setErrMsg("Passwords must match!");
        setIsLoading(false);
        setIsEditing(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { current_password, new_password } = error.response.data;

        if (
          current_password &&
          current_password[0] ===
            "This password is the same as your current password."
        ) {
          setErrMsg("New password cannot be the same as the old one!");
        } else if (
          new_password &&
          new_password[0] === "This password is too common."
        ) {
          setErrMsg("Please choose a stronger password.");
        } else {
          // Handle other error scenarios as needed
          setErrMsg("An error occurred while changing the password.");
        }
      } else {
        // Handle other types of errors
        setErrMsg("An unexpected error occurred.");
      }

      //errStatus(error.response.data.current_password);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 mx-20 bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
  {/* Header */}
  <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 relative">
    <h3 className="text-xl 2xl:text-2xl font-euclid text-white">Change password</h3>
    {!isEditing && (
      <div
        className="px-3 py-1 bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white rounded-md text-sm 2xl:text-lg cursor-pointer hover:opacity-90 transition-all absolute -right-2 -top-2"
        onClick={() => setIsEditing(true)}
      >
        Change
      </div>
    )}
  </div>

  {/* Content */}
  {isEditing ? (
    <div className="flex flex-col gap-3">
      <input
        type="password"
        placeholder="Enter your old password"
        onChange={handleOldPass}
        className="bg-[#111827] border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3E6FF4]"
      />
      <input
        type="password"
        placeholder="Enter your new password"
        onChange={handleNewPass}
        className="bg-[#111827] border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3E6FF4]"
      />
      <input
        type="password"
        placeholder="Re-enter your new password"
        onChange={handleReNewPass}
        className="bg-[#111827] border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3E6FF4]"
      />

      <div className="flex flex-row gap-3 mt-3">
        {isLoading ? (
          <Loader loading_name={"Updating pass..."} />
        ) : (
          <>
            <button
              onClick={passChange}
              className="bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white rounded-md px-4 py-2 transition-all"
            >
              Change
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-600 hover:bg-red-500 text-white rounded-md px-4 py-2 transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <label className="text-gray-300 font-normal text-sm 2xl:text-lg">Last update</label>
        <p className="text-white font-normal text-sm 2xl:text-lg">{user_obj.last_password_change}</p>
      </div>
    </div>
  )}

  {msg && <p className="text-green-500 mt-2">{msg}</p>}
  {errMsg && <p className="text-red-500 mt-2">{errMsg}</p>}
</div>

  );
};

export default PasswordChange;
