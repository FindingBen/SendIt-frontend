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
      <div className="flex flex-col rounded-2xl p-4">
        <h3 className="flex flex-row text-normal border-b-2 border-gray-800 lg:text-xl 2xl:text-2xl text-left font-euclid text-white relative">
          General settings
          <div className="">
            {isEditing ? (
              isLoading ? (
                <Loader loading_name={"Updating..."} />
              ) : (
                <div className="flex flex-row gap-2 absolute -right-2 -top-2">
                  <button
                    onClick={updateUser}
                    className="bg-ngrokBlue hover:bg-blue-500 duration-300 text-white text-sm font-euclid px-1 py-1 rounded-md"
                    type="submit"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 hover:bg-red-300 duration-300 text-white font-euclid text-sm py-1 px-1 rounded-md"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              )
            ) : (
              <button
                className="px-1 py-1 flex flex-row gap-1 bg-ngrokBlue 2xl:text-lg text-white text-sm border-gray-800 rounded-md absolute -right-2 -top-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                Change
              </button>
            )}
          </div>
        </h3>
        <div className="flex flex-col mt-5">
          <div className="flex flex-row gap-3 relative">
            <label
              for="first_name"
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-euclid text-gray-300 dark:text-white"
            >
              First name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="first_name"
                className="block bg-gray-500 hover:bg-gray-400 duration-200 text-light font-light xl:text-sm 2xl:text-xl text-xs rounded-lg py-1 px-4"
                defaultValue={currentUserState.first_name}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <p className="block text-white absolute 2xl:text-xl right-2 top-0">
                {currentUserState?.first_name}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-3 mt-3 relative">
            <label
              for="last_name"
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-euclid text-gray-300 dark:text-white"
            >
              Last name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="last_name"
                className="block bg-gray-500 hover:bg-gray-400 text-light 2xl:text-xl font-light py-1 px-4 duration-200 xl:text-sm text-xs rounded-lg"
                defaultValue={currentUserState?.last_name}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            ) : (
              <p className="block text-white absolute 2xl:text-xl right-2 top-0">
                {currentUserState?.last_name}
              </p>
            )}
          </div>

          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="last_name"
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-euclid text-gray-300 dark:text-white"
            >
              Username
            </label>

            <p className="block text-white absolute 2xl:text-xl right-2 top-0">
              {currentUserState?.username}
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="email"
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-euclid text-gray-300 dark:text-white"
            >
              Email address
            </label>
            <p className="block text-white absolute right-2 top-0">
              {currentUserState?.custom_email &&
                `${currentUserState?.custom_email.substring(
                  0,
                  currentUserState?.custom_email.indexOf("@") + 1
                )}`}
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="email"
              className="block mb-2 text-ss xl:text-normal text-left 2xl:text-xl font-euclid text-gray-300 dark:text-white"
            >
              Account type
            </label>
            <p className="block text-white absolute 2xl:text-xl right-2 top-0">
              {currentUserState?.user_type}
            </p>
          </div>

          {/* {isEditing ? (
            <div className="flex flex-row ">
              {isLoading ? (
                <Loader loading_name={"Updating..."} />
              ) : (
                <div className="flex flex-row gap-2">
                  <button
                    onClick={updateUser}
                    className="bg-ngrokBlue hover:bg-blue-500 duration-300 text-white font-euclid text-ss 2xl:text-xl xl:text-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
                    type="submit"
                  >
                    <p>Update</p>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 hover:bg-red-300 duration-300 text-white font-euclid text-ss 2xl:text-xl xl:text-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
                    type="submit"
                  >
                    <p>Cancel</p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )} */}
          {msg && <p className="text-green-500 mt-5">{msg}</p>}
          {errorMsg && <p className="text-red-500 mt-5">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
