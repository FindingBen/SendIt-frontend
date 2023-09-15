import React, { useEffect, useState } from "react";
import { selectCurrentToken, logOut } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import PasswordChange from "../utils/PasswordChange";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const [username, setUsername] = useState();

  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
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
  }, []);

  const handleUser = (e) => setUsername(e.target.value);

  const handleNewName = (e) => setNewName(e.target.value);

  const handleNewLastName = (e) => setNewLastName(e.target.value);

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
      console.log(response.data);
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
  console.log(user);
  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <h3 class="text-3xl text-left font-extralight text-white/50">
              Account settings
            </h3>
          </div>
          <div className="flex gap-3">
            <div className="flex-col">
              <div
                className="flex-initial w-96 h-4/5 rounded-lg p-10 mt-4"
                style={{
                  backgroundColor: "#1118274D",
                }}
              >
                {" "}
                <PasswordChange></PasswordChange>
              </div>
              <div
                className="flex w-96 h-2/4 rounded-lg mt-3"
                style={{
                  backgroundColor: "#1118274D",
                }}
              >
                <h3 class="text-2xl text-left font-extralight text-white/50 p-10">
                  Package information
                </h3>
              </div>
            </div>
            <div
              className="flex-initial w-50 rounded-lg p-10 mt-4"
              style={{
                backgroundColor: "#1118274D",
              }}
            >
              <h3 class="text-2xl text-left font-extralight text-white/50">
                General settings
              </h3>
              <div className="grid gap-2 w-100 mt-3">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
