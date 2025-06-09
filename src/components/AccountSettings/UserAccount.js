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

  setTimeout(() => setMsg(), 4000);

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
    <div className="flex gap-3">
      <div className="flex flex-col rounded-2xl p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 lg:w-[420px] md:h-[535px] lg:h-[535px] xl:w-[500px] xs:w-[330px] 2xl:w-[450px] h-[440px] xl:h-[540px] 2xl:h-[650px]">
        <h3 class="flex flex-row text-normal lg:text-xl 2xl:text-2xl text-left font-normal text-white relative">
          General settings
          <div className="px-2 py-2 flex flex-row gap-1 bg-cyan-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-cyan-500 cursor-pointer">
            <p
              className="lg:text-normal xs:text-xs 2xl:text-normal"
              onClick={() => setIsEditing(true)}
            >
              Change
            </p>
          </div>
        </h3>
        <div className="flex flex-col mt-5">
          <div className="flex flex-row gap-3 relative">
            <label
              for="first_name"
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-normal text-gray-300 dark:text-white"
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
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-normal text-gray-300 dark:text-white"
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
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-normal text-gray-300 dark:text-white"
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
              className="block mb-2 text-ss xl:text-normal 2xl:text-xl text-left font-normal text-gray-300 dark:text-white"
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
              className="block mb-2 text-ss xl:text-normal text-left 2xl:text-xl font-normal text-gray-300 dark:text-white"
            >
              Account type
            </label>
            <p className="block text-white absolute 2xl:text-xl right-2 top-0">
              {currentUserState?.user_type}
            </p>
          </div>

          {isEditing ? (
            <div className="flex flex-row ">
              {isLoading ? (
                <Loader loading_name={"Updating..."} />
              ) : (
                <button
                  onClick={updateUser}
                  className="bg-sky-800 hover:bg-sky-400 duration-300 text-white font-light text-ss 2xl:text-xl xl:text-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
                  type="submit"
                >
                  <p>Update</p>
                </button>
              )}
            </div>
          ) : (
            <></>
          )}
          {msg && <p className="text-green-500 mt-5">{msg}</p>}
          {errorMsg && <p className="text-red-500 mt-5">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
