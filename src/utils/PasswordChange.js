import React, { useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";

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
    <div className="bg-gradient-to-b from-lighterMainBlue to-mainBlue shadow-md border-gray-800 border-2 rounded-2xl p-4 xs:mt-2 md:mt-0 xs:w-[330px] lg:w-[400px] 2xl:w-[450px] md:mr-2 md:h-[240px] 2xl:h-[270px]">
      <div className="flex flex-col">
        {!isEditing ? (
          <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left font-semibold text-white relative">
            Change password
            <div className="px-2 py-2 flex flex-row gap-1 bg-cyan-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-blue-500 cursor-pointer">
              <p
                className="lg:text-normal xs:text-xs 2xl:text-normal"
                onClick={() => setIsEditing(true)}
              >
                Change
              </p>
            </div>
          </h3>
        ) : (
          <></>
        )}

        {isEditing ? (
          <div className="flex flex-col items-center">
            <div className="flex flex-row mt-2 gap-2 relative">
              <input
                type="password"
                className="password-change-inputs"
                onChange={handleOldPass}
                placeholder="Enter your old password.."
              ></input>
            </div>
            <div className="flex flex-row mt-2 relative">
              <input
                type="password"
                className="password-change-inputs"
                placeholder="Enter your new password"
                onChange={handleNewPass}
              ></input>
            </div>
            <div className="flex flex-row mt-3 relative">
              <input
                type="password"
                className="password-change-inputs"
                placeholder="Re-enter your new password"
                onChange={handleReNewPass}
              ></input>
            </div>
            <div className="flex flex-row gap-2">
              <button
                className="flex items-start bg-cyan-800 hover:bg-cyan-400 duration-300 text-white xl:text-normal text-normal md:text-sm font-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4"
                onClick={passChange}
              >
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-cyan-600"
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
                ) : (
                  <p className="mx-auto">Change</p>
                )}
              </button>
              <button
                className="flex items-center bg-red-800 hover:bg-red-400 duration-300 text-white xl:text-normal md:text-sm font-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4"
                onClick={() => setIsEditing(false)}
              >
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-cyan-600"
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
                ) : (
                  <p className="mx-auto">Cancel</p>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-row mt-5 relative">
              <label className="block mt-1 text-ss xl:text-normal 2xl:text-lg text-left font-normal text-gray-300 dark:text-white">
                Password
              </label>
              <p className="block text-white absolute 2xl:text-lg right-2 top-0">
                ************
              </p>
            </div>
            <div className="flex flex-row mt-2 relative">
              <label className="block mt-1 text-ss xl:text-normal 2xl:text-lg text-left font-normal text-gray-300 dark:text-white">
                Last update
              </label>
              <p className="block text-white absolute 2xl:text-lg right-2 top-0">
                {user_obj.last_password_change}
              </p>
            </div>
          </div>
        )}
        {msg && <p className="text-green-500">{msg}</p>}
        {errMsg && <p className="text-red-500">{errMsg}</p>}
      </div>
    </div>
  );
};

export default PasswordChange;
