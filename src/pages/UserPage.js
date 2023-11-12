import React, { useEffect, useState } from "react";
import { selectCurrentToken, logOut } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import PasswordChange from "../utils/PasswordChange";
import { motion } from "framer-motion";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const [username, setUsername] = useState();
  const [packagePlan, setPackagePlan] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);

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
  }, [msg]);

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3000);
    setTimeout(() => setMsg(), 3000);
  }, [errorMsg, msg]);

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

  let getUser = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/user_account/${params.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );

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
      formData,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );

    if (response.status === 200) {
      setIsLoading(false);
    }
  };

  let purchase_history = async (e) => {
    try {
      let response = await axiosInstance.get(`stripe/purchases/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      if (response.status === 200) {
        setPurchases(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const copyPurchaseId = (id, index) => {
    const input = document.createElement("input");
    input.value = id;
    document.body.appendChild(input);

    // Select the text inside the input element
    input.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);
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
    <section className="h-screen w-full flex-d items-center justify-center">
      <div className="flex flex-col lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="xl:text-3xl text-2xl text-left font-extralight text-white/50">
              Account settings and purchase history
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col">
              <div className="w-full xl:h-4/5 rounded-lg p-4 xl:p-10 mt-4 bg-darkestGray">
                {" "}
                <PasswordChange
                  errStatus={errStatus}
                  status={passStatus}
                ></PasswordChange>
              </div>
              <div className="flex flex-col xl:w-full xl:h-3/4 p-2 rounded-lg mt-3 bg-darkestGray">
                <h3 class="xl:text-2xl text-xl text-left font-extralight text-white/50 p-3 xl:p-10">
                  Subscription
                </h3>
                <div className="flex flex-row">
                  <label
                    for="first_name"
                    className="ml-5 mr-2 text-sm text-left font-medium text-gray-300 dark:text-white"
                  >
                    Package type:
                  </label>
                  <span class="px-2 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                    {user?.package_plan?.plan_type}
                  </span>
                </div>
                <div className="flex flex-row mt-2">
                  <label
                    for="first_name"
                    className="ml-5 mr-2 text-sm text-left font-medium text-gray-300 dark:text-white"
                  >
                    Sms count: {user?.sms_count}
                  </label>
                </div>
                <Link
                  to="/package_plan/"
                  className="bg-sky-800 ml-5 hover:bg-sky-400 text-white font-light py-1 px-2 xl:py-2 xl:px-4 rounded w-20 mt-4 mb-4"
                  type="submit"
                >
                  Update
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg p-4 mt-4 bg-darkestGray">
              <h3 class="text-xl xl:text-2xl text-left font-extralight text-white/50">
                General settings
              </h3>
              <div className="grid gap-2 mt-3">
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

                <button
                  onClick={updateUser}
                  className="bg-sky-800 hover:bg-sky-400 duration-300 text-white font-light py-1 px-2 xl:py-2 xl:px-4 rounded w-20"
                  type="submit"
                >
                  {!isLoading ? <p>Save</p> : <p>Saving..</p>}
                </button>
              </div>
            </div>
            <div className="flex-initial rounded-lg p-4 xl:p-10 mt-4 bg-darkestGray">
              <h3 class="text-2xl text-left font-extralight text-white/50">
                Purchase history
              </h3>

              <p class="text-left text-sm text-gray-500 dark:text-gray-400">
                Copy the purchase id and include it in your inquire in case of
                any questions{" "}
              </p>

              {purchases.length > 0 ? (
                <ul className="flex flex-col items-left mt-3 max-h-80 text-white/50 overflow-y-scroll">
                  {purchases?.map((purchase, index) => {
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2,
                          ease: [0, 0.41, 0.1, 1.01],
                        }}
                        className="relative text-base text-left text-gray-300 bg-slate-800 mb-2 rounded-md p-3 hover:bg-slate-800/50 cursor-pointer"
                        key={purchase.id}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-4 h-4 xl:w-5 xl:h-5 absolute right-1 top-1 cursor-pointer"
                          onClick={() =>
                            copyPurchaseId(purchase.payment_id, index)
                          }
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                          />
                        </svg>

                        <div className="ml-1 flex flex-row">
                          <p className="font-bold">Product name:</p>
                          <p className="ml-1"> {purchase.package_name}</p>
                        </div>
                        <div className="ml-1 flex flex-row">
                          <p className="font-bold">Price:</p>
                          <p className="ml-1"> {purchase.price + "€"}</p>
                        </div>
                        <div className="ml-1 flex flex-row">
                          <p className="font-bold">Purchase id:</p>
                          <p className="ml-1"> {purchase.payment_id}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center mt-4 text-grayWhite">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.0"
                    stroke="currentColor"
                    class="w-20 h-20 opacity-75"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                  <p className="text-sm mt-3 text-grayWhite">
                    No purchases yet..
                  </p>
                </div>
              )}
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
