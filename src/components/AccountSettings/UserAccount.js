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
      <div className="flex flex-col rounded-2xl p-4 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 lg:w-[420px] lg:h-[535px] xl:w-[500px] xs:w-[330px] 2xl:w-[450px] h-[440px] xl:h-[540px] 2xl:h-[650px]">
        <h3 class="flex flex-row text-normal lg:text-xl 2xl:text-2xl text-left font-semibold text-white relative">
          General settings
          <div className="px-2 py-2 flex flex-row gap-1 bg-blue-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-blue-500 cursor-pointer">
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
            <button
              onClick={updateUser}
              className="bg-sky-800 hover:bg-sky-400 duration-300 text-white font-light text-ss 2xl:text-xl xl:text-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
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
