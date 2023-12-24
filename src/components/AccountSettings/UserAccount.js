import React, { useState, useEffect } from "react";
import PasswordChange from "../../utils/PasswordChange";
import useAxiosInstance from "../../utils/axiosInstance";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
const UserAccount = ({ user }) => {
  const axiosInstance = useAxiosInstance();

  const [username, setUsername] = useState();
  const [packagePlan, setPackagePlan] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const params = useParams();
  const navigate = useNavigate();
  const [newLastName, setNewLastName] = useState();
  const [userObj, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  console.log(user);
  const handleUser = (e) => {
    setUsername(e.target.value);
    setMsg();
    setErrorMsg();
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
    setMsg();
    setErrorMsg();
  };

  const handleNewLastName = (e) => {
    setNewLastName(e.target.value);
    setMsg();
    setErrorMsg();
  };

  let updateUser = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = {
      username: username,
      first_name: newName,
      last_name: newLastName,
    };

    let response = await axiosInstance.put(
      `/api/update_user/${params.id}/`,
      formData
    );

    if (response.status === 200) {
      setIsLoading(false);
    }
  };

  const passStatus = (message) => {
    setMsg(message);
    setErrorMsg();
  };

  const errStatus = (message) => {
    setErrorMsg(message);
    setMsg();
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col relative">
        <div className="rounded-lg p-4 mt-4 bg-darkestGray">
          {" "}
          <PasswordChange
            errStatus={errStatus}
            status={passStatus}
          ></PasswordChange>
        </div>
      </div>
      <div className="flex flex-col rounded-lg p-4 mt-4 bg-darkestGray">
        <h3 class="text-xl xl:text-2xl text-left font-extralight text-white/50">
          General settings
        </h3>
        <div className="flex flex-col mt-3">
          <div className="flex flex-row gap-2">
            <div>
              <label
                for="first_name"
                className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="first_name"
                className="block bg-gray-500 hover:bg-gray-400 duration-200 text-light font-light py-2 px-4 rounded-md"
                value={newName}
                onChange={handleNewName}
              />
            </div>
            <div>
              <label
                for="last_name"
                className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-4 duration-200 rounded"
                placeholder="Doe"
                value={newLastName}
                onChange={handleNewLastName}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div>
              <label
                for="last_name"
                className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="last_name"
                className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-4 duration-200 rounded"
                placeholder="Doe"
                value={user?.username}
                disabled
                onChange={handleUser}
              />
            </div>
            <div className="mb-3">
              <label
                for="email"
                className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white"
              >
                Email address
              </label>
              <input
                className="block bg-gray-500 hover:bg-gray-400 text-light font-light py-2 px-4 duration-200 rounded"
                type="email"
                value={user?.email}
                disabled
              />
            </div>
          </div>
          <button
            onClick={updateUser}
            className="bg-sky-800 hover:bg-sky-400 duration-300 text-white font-light py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
            type="submit"
          >
            {!isLoading ? (
              <p>Save</p>
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
        </div>
      </div>
      {errorMsg && errorMsg.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.8,
            ease: [0, 0.41, 0.1, 1.01],
          }}
          id="toast-warning"
          class="flex items-center w-full max-w-xs mx-auto p-3 xl:p-4 text-gray-200 bg-gray-600 rounded-lg shadow absolute bottom-24 left-[40%]"
          role="alert"
        >
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-orange-100 rounded-lg">
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <span class="sr-only">Warning icon</span>
          </div>
          <div class="ml-3 text-sm font-normal">{errorMsg}</div>
          <button
            type="button"
            class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 duration-300 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            data-dismiss-target="#toast-warning"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              onClick={() => setErrorMsg()}
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </motion.div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default UserAccount;
