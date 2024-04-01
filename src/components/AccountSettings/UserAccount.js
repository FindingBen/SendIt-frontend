import React, { useState, useEffect } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRedux } from "../../constants/reduxImports";
import { setUserInfo } from "../../redux/reducers/userReducer";
import SmsPill from "../SmsPill/SmsPill";

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
      dispatch(setUserInfo({ ...formData }));
      setIsLoading(false);
      setIsEditing(false);
      setMsg("Successfully updated!");
    } else {
      setErrorMsg("Updated failed!");
    }
  };

  return (
    <div className="flex gap-3 mr-5">
      <div className="flex flex-col rounded-2xl p-4 mt-4 bg-black w-80 h-[540px]">
        <h3 class="flex flex-row text-xl xl:text-2xl text-left font-extralight text-white relative">
          General settings
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            onClick={() => setIsEditing(true)}
            class="w-8 h-8 absolute right-0 cursor-pointer hover:bg-gray-500 p-1 rounded-xl"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </h3>
        <div className="flex flex-col mt-5">
          <div className="flex flex-row gap-3 relative">
            <label
              for="first_name"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              First name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="first_name"
                className="block bg-gray-500 hover:bg-gray-400 duration-200 text-light font-light xl:text-sm text-xs rounded-lg py-1 px-4"
                defaultValue={currentUserState.first_name}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <p className="block text-white absolute right-2 top-0">
                {currentUserState.first_name}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-3 mt-3 relative">
            <label
              for="last_name"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              Last name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="last_name"
                className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-1 px-4 duration-200 xl:text-sm text-xs rounded-lg"
                defaultValue={currentUserState.last_name}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            ) : (
              <p className="block text-white absolute right-2 top-0">
                {currentUserState.last_name}
              </p>
            )}
          </div>

          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="last_name"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              Username
            </label>

            <p className="block text-white absolute right-2 top-0">
              {currentUserState.username}
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="email"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              Email address
            </label>
            <p className="block text-white absolute right-2 top-0">
              {currentUserState.custom_email &&
                `${currentUserState.custom_email.substring(
                  0,
                  currentUserState.custom_email.indexOf("@") + 1
                )}`}
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="email"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              Account type
            </label>
            <p className="block text-white absolute right-2 top-0">
              {currentUserState.user_type}
            </p>
          </div>
          <div className="flex flex-row gap-4 mt-3 relative">
            <label
              for="email"
              className="block mb-2 text-ss xl:text-normal text-left font-normal text-gray-300 dark:text-white"
            >
              Package Plan
            </label>
            <p className="block text-white absolute right-2 top-0">
              {currentPackageState.package_plan}
            </p>
          </div>

          {isEditing ? (
            <button
              onClick={updateUser}
              className="bg-sky-800 hover:bg-sky-400 duration-300 text-white font-light text-ss xl:text-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
              type="submit"
            >
              {!isLoading ? (
                <p>Update</p>
              ) : (
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
            </button>
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
