import React, { useState, useEffect } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRedux } from "../../constants/reduxImports";
import { setUserInfo } from "../../redux/reducers/userReducer";
import SmsPill from "../SmsPill/SmsPill";
import Loader from "../LoaderSkeleton/Loader";

const UserAccount = () => {
  const axiosInstance = useAxiosInstance();
  const { currentPackageState, dispatch, currentUserState } = useRedux();
  const [username, setUsername] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [newLastName, setNewLastName] = useState();
  const [userObj, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  let updateUser = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = {};

    // Only add fields to formData if they have been edited
    if (newName !== undefined) {
      formData.first_name = newName;
    }
    if (newLastName !== undefined) {
      formData.last_name = newLastName;
    }
    let response = await axiosInstance.put(
      `/api/update_user/${params.id}/`,
      formData
    );

    if (response.status === 200) {
      dispatch(setUserInfo(formData));
      setIsLoading(false);
      setIsEditing(false);
      setMsg("Successfully updated!");
    } else {
      setErrorMsg("Updated failed!");
    }
  };

  return (
    <div className="flex-1 gap-3 mx-20">
  <div className="flex flex-col bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] p-6">
    {/* Header */}
    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-5 relative">
      <h3 className="text-xl 2xl:text-2xl font-euclid text-white">General Settings</h3>
      <div className="absolute right-4 top-1">
        {isEditing ? (
          isLoading ? (
            <Loader loading_name={"Updating..."} />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={updateUser}
                className="bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white font-euclid text-sm 2xl:text-base px-3 py-1 rounded-md transition-all"
                type="submit"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 hover:bg-red-400 text-white font-euclid text-sm 2xl:text-base px-3 py-1 rounded-md transition-all"
                type="button"
              >
                Cancel
              </button>
            </div>
          )
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] hover:opacity-90 text-white font-euclid text-sm 2xl:text-base px-3 py-1 rounded-md transition-all"
          >
            Change
          </button>
        )}
      </div>
    </div>

    {/* Form Fields */}
    <div className="flex flex-col gap-5 text-start">
      {/* First Name */}
      <div className="flex flex-col">
        <label
          htmlFor="first_name"
          className="text-gray-300 text-sm xl:text-normal 2xl:text-lg font-euclid mb-1"
        >
          First Name
        </label>
        {isEditing ? (
          <input
            type="text"
            id="first_name"
            className="w-full bg-[#111827] border border-gray-700 text-white font-light text-sm xl:text-normal 2xl:text-lg rounded-lg px-4 py-2 focus:outline-none focus:border-[#3E6FF4] transition-all"
            defaultValue={currentUserState.first_name}
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          <p className="text-white font-light text-sm xl:text-normal 2xl:text-lg">{currentUserState?.first_name}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="flex flex-col">
        <label
          htmlFor="last_name"
          className="text-gray-300 text-sm xl:text-normal 2xl:text-lg font-euclid mb-1"
        >
          Last Name
        </label>
        {isEditing ? (
          <input
            type="text"
            id="last_name"
            className="w-full bg-[#111827] border border-gray-700 text-white font-light text-sm xl:text-normal 2xl:text-lg rounded-lg px-4 py-2 focus:outline-none focus:border-[#3E6FF4] transition-all"
            defaultValue={currentUserState?.last_name}
            onChange={(e) => setNewLastName(e.target.value)}
          />
        ) : (
          <p className="text-white font-light text-sm xl:text-normal 2xl:text-lg">{currentUserState?.last_name}</p>
        )}
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="text-gray-300 text-sm xl:text-normal 2xl:text-lg font-euclid mb-1">Username</label>
        <p className="text-white font-light text-sm xl:text-normal 2xl:text-lg">{currentUserState?.username}</p>
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-gray-300 text-sm xl:text-normal 2xl:text-lg font-euclid mb-1">Email Address</label>
        <p className="text-white font-light text-sm xl:text-normal 2xl:text-lg">
          {currentUserState?.custom_email &&
            `${currentUserState?.custom_email.substring(0, currentUserState?.custom_email.indexOf("@") + 1)}`}
        </p>
      </div>

      {/* Account Type */}
      <div className="flex flex-col">
        <label className="text-gray-300 text-sm xl:text-normal 2xl:text-lg font-euclid mb-1">Account Type</label>
        <p className="text-white font-light text-sm xl:text-normal 2xl:text-lg">{currentUserState?.user_type}</p>
      </div>

      {/* Feedback Messages */}
      {msg && <p className="text-green-500 mt-3">{msg}</p>}
      {errorMsg && <p className="text-red-500 mt-3">{errorMsg}</p>}
    </div>
  </div>
</div>


  );
};

export default UserAccount;
