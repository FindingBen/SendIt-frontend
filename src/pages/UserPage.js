import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import Billings from "../components/AccountSettings/Billings";
import UserAccount from "../components/AccountSettings/UserAccount";
import Plans from "../components/AccountSettings/Plans";
import PasswordChange from "../utils/PasswordChange";
import { motion } from "framer-motion";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const [username, setUsername] = useState();
  const [packagePlans, setPackage] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const [selectedComponent, setSelectedComponent] = useState("account");
  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    purchase_history();
    getPackages();
  }, [msg]);

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3000);
    setTimeout(() => setMsg(), 3000);
  }, [errorMsg, msg]);

  let getPackages = async () => {
    try {
      let response = await axiosInstance.get("/api/package_plan/");

      if (response.status === 200) {
        let filteredPackages = response.data.filter((item) => item.id !== 1);

        setPackage(filteredPackages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let getUser = async () => {
    try {
      let response = await axiosInstance.get(`/api/user_account/${params.id}/`);

      if (response.status === 200) {
        setUser(response.data);
      } else {
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  let purchase_history = async (e) => {
    try {
      let response = await axiosInstance.get(`stripe/purchases/${params.id}`);
      if (response.status === 200) {
        setPurchases(response.data);
      }
    } catch (e) {
      console.log(e);
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
    <section className="min-h-screen w-full items-center justify-center relative">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-black border-l border-white">
            <h3 class="xl:text-3xl text-2xl text-left font-extralight text-white mx-20">
              User page
            </h3>
          </div>

          <div className="mx-20">
            <div className="flex flex-row mt-2">
              <UserAccount user={user} />
              <div className="flex-1 flex-col">
                <Billings purchases={purchases} />
                <PasswordChange errStatus={errStatus} status={passStatus} />
              </div>
            </div>
          </div>
        </div>
        {msg && msg.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.8,
              ease: [0, 0.41, 0.1, 1.01],
            }}
            id="toast-success"
            class="flex items-center w-full max-w-xs mx-auto p-4 text-gray-300 bg-gray-600 rounded-lg shadow absolute bottom-40 left-[55%]"
            role="alert"
          >
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-800 bg-green-100 rounded-lg">
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="sr-only">Check icon</span>
            </div>
            <div class="ml-3 text-sm font-normal">{msg}</div>
            <button
              type="button"
              class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              data-dismiss-target="#toast-success"
              aria-label="Close"
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                onClick={() => setMsg()}
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
        {errorMsg && errorMsg.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.6,
              ease: [0, 0.41, 0.1, 1.01],
            }}
            id="toast-warning"
            class="flex items-center w-full max-w-xs mx-auto p-3 xl:p-4 text-gray-200 bg-gray-600 rounded-lg shadow absolute bottom-40 left-[50%]"
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
    </section>
  );
};

export default UserPage;
