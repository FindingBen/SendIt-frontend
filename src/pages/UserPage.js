import React, { useEffect, useState } from "react";
import { selectCurrentToken, logOut } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import PasswordChange from "../utils/PasswordChange";
import jwtDecode from "jwt-decode";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const [username, setUsername] = useState();
  const [packagePlan, setPackagePlan] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);
  const [copied, setCopied] = useState(false);

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
  }, [copied]);

  const handleUser = (e) => setUsername(e.target.value);

  const handleNewName = (e) => setNewName(e.target.value);

  const handleNewLastName = (e) => setNewLastName(e.target.value);
  console.log(purchases);
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
        localStorage.removeItem("tokens");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  let updateUser = async (e) => {
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
    console.log(response.data);
    if (response.status === 200) {
      console.log("success");
      navigate("/home");
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
    setCopied(true);
    const input = document.createElement("input");
    input.value = id;
    document.body.appendChild(input);

    // Select the text inside the input element
    input.select();

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(input);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <section className="h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="text-3xl text-left font-extralight text-white/50">
              Account settings and purchase history
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="flex-col">
              <div
                className="flex-initial xl:w-full xl:h-4/5 rounded-lg p-10 mt-4"
                style={{
                  backgroundColor: "#1118274D",
                }}
              >
                {" "}
                <PasswordChange></PasswordChange>
              </div>
              <div
                className="xl:w-full h-2/6 xl:h-2/5 rounded-lg mt-3 flex flex-col"
                style={{
                  backgroundColor: "#1118274D",
                }}
              >
                <h3 class="text-2xl text-left font-extralight text-white/50 p-4 xl:p-10">
                  Package information
                </h3>
                <div className="flex flex-row">
                  <label
                    for="first_name"
                    className="ml-10 mr-2 text-sm text-left font-medium text-gray-300 dark:text-white"
                  >
                    Package type:
                  </label>
                  <span class="bg-yellow-400 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                    {user?.package_plan?.plan_type}
                  </span>
                </div>
                <div className="flex flex-row mt-2">
                  <label
                    for="first_name"
                    className="ml-10 mr-2 text-sm text-left font-medium text-gray-300 dark:text-white"
                  >
                    Sms count: {user?.sms_count}
                  </label>
                </div>
                <Link
                  to="/package_plan/"
                  className="bg-sky-800 hover:bg-sky-400 text-white font-sm xl:font-base font-light py-2 px-2 ml-10 mt-2 rounded w-25"
                  type="submit"
                >
                  Update
                </Link>
              </div>
            </div>
            <div className="flex-initial h-1/2 w-1/3 xl:w-1/3 rounded-lg p-14 xl:p-10 mt-4 bg-darkestGray">
              <h3 class="text-2xl text-left font-extralight text-white/50">
                General settings
              </h3>
              <div className="grid gap-2  mt-3">
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
                    className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100"
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
                    className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100"
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
                    className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100"
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
                    className="block bg-gray-500 hover:bg-gray-400 mt-1 text-light font-light py-2 px-4 rounded w-100"
                    type="email"
                    value={user?.email}
                    disabled
                  />
                </div>
                <button
                  onClick={updateUser}
                  className="bg-sky-800 hover:bg-sky-400 text-white font-light py-2 px-4 rounded w-25"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex-initial h-1/2 xl:w-1/3 rounded-lg p-14 xl:p-10 mt-4 bg-darkestGray">
              <h3 class="text-2xl text-left font-extralight text-white/50">
                Purchase history
              </h3>

              <p class="text-left text-sm text-gray-500 dark:text-gray-400">
                Copy the purchase id and include it in your inquire in case of
                any questions{" "}
              </p>

              <ul className="flex flex-col items-left mt-3 max-h-72 text-white/50 overflow-y-scroll">
                {purchases?.map((purchase, index) => {
                  return (
                    <li
                      className="relative text-base text-left text-gray-300 bg-slate-800 mb-2 rounded-md p-3"
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
                        <p className="ml-1"> {purchase.price}</p>
                      </div>
                      <div className="ml-1 flex flex-row">
                        <p className="font-bold">Purchase id:</p>
                        <p className="ml-1"> {purchase.payment_id}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
