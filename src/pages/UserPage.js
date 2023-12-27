import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import Billings from "../components/AccountSettings/Billings";
import UserAccount from "../components/AccountSettings/UserAccount";
import Plans from "../components/AccountSettings/Plans";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";
import ModalComponent from "../components/ModalComponent";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const [username, setUsername] = useState();
  const [packagePlans, setPackage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);

  const [selectedComponent, setSelectedComponent] = useState("account");
  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  const handleTabClick = (componentKey) => {
    setSelectedComponent((prevSelectedComponent) =>
      prevSelectedComponent === componentKey ? null : componentKey
    );
  };

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

  const componentMap = {
    account: <UserAccount user={user} />,
    billing: <Billings purchases={purchases} />,
    plans: <Plans packagePlan={packagePlans} />,
  };

  return (
    <section className="h-screen w-full flex-d items-center justify-center">
      <div className="flex flex-col lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="xl:text-3xl text-2xl text-left font-extralight text-white">
              User page
            </h3>
          </div>

          <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <a
                  className={`inline-block p-4 border-b-2 ${
                    selectedComponent === "account"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
                  onClick={() => handleTabClick("account")}
                >
                  Account settings
                </a>
              </li>
              <li className="me-2">
                <a
                  className={`inline-block p-4 border-b-2 ${
                    selectedComponent === "billing"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
                  onClick={() => handleTabClick("billing")}
                >
                  Billing histroy
                </a>
              </li>
              <li className="me-2">
                <a
                  className={`inline-block p-4 border-b-2 ${
                    selectedComponent === "plans"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
                  onClick={() => handleTabClick("plans")}
                >
                  Plans
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 mt-2">
            {selectedComponent && componentMap[selectedComponent]}
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
          class="flex items-center w-full max-w-xs mx-auto p-4 text-gray-300 bg-gray-600 rounded-lg shadow"
          role="alert"
        >
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-800 bg-green-100 rounded-lg ">
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
            delay: 0.8,
            ease: [0, 0.41, 0.1, 1.01],
          }}
          id="toast-warning"
          class="flex items-center w-full max-w-xs mx-auto p-3 xl:p-4 text-gray-200 bg-gray-600 rounded-lg shadow"
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
    </section>
  );
};

export default UserPage;
