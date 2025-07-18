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
    <div className="flex-1 p-4 mx-20">
      <div className="flex flex-col h-52">
        <h3 class="flex flex-row border-gray-800 border-b-2 font-euclid text-white text-xl 2xl:text-2xl relative">
          Change password
          {isEditing ? (
            <></>
          ) : (
            <div className="px-1 py-1 2xl:text-xl flex flex-row gap-1 bg-ngrokBlue text-white border-gray-800 rounded-md absolute -right-2 -top-2 hover:bg-blue-500 cursor-pointer">
              <p
                className="lg:text-sm 2xl:text-lg"
                onClick={() => setIsEditing(true)}
              >
                Change
              </p>
            </div>
          )}
        </h3>

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
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <Loader loading_name={"Updating pass..."} />
              ) : (
                <div className="flex flex-row gap-2">
                  <button
                    className="flex items-start bg-ngrokBlue hover:bg-blue-500 duration-300 text-white xl:text-normal text-normal md:text-sm font-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4"
                    onClick={passChange}
                  >
                    <p className="mx-auto">Change</p>
                  </button>
                  <button
                    className="flex items-center bg-red-800 hover:bg-red-400 duration-300 text-white xl:text-normal md:text-sm font-normal py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4"
                    onClick={() => setIsEditing(false)}
                  >
                    <p className="mx-auto">Cancel</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* <div className="flex flex-row mt-5 relative">
              
            </div> */}
            <div className="flex flex-row mt-5 relative">
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
