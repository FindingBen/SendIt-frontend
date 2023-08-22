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
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row" style={{ paddingLeft: "2.5%" }}>
            <div
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width: "95%" }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left">
                    Account settings
                  </h1>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right">
                    Sms credit count: {user?.sms_count}
                  </h1>
                </div>
              </div>
            </div>
            <div className="grid gap-3 w-50 mt-4" style={{ marginLeft: "25%" }}>
              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-300 hover:bg-gray-50 mt-1 text-white border border-gray-300 rounded w-full"
                  value={newName}
                  onChange={handleNewName}
                />
              </div>
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-300 hover:bg-gray-50 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-full"
                  placeholder="Doe"
                  value={newLastName}
                  onChange={handleNewLastName}
                />
              </div>
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-300 hover:bg-gray-50 mt-1 text-dark font-bold py-2 px-4 border border-blue-700 rounded w-full"
                  placeholder="Doe"
                  value={user?.username}
                  disabled
                  onChange={handleUser}
                />
              </div>
              <div className="mb-6">
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                >
                  Email address
                </label>
                <input
                  className="bg-gray-300 hover:bg-gray-50 mt-1 text-dark py-2 px-4 border border-blue-700 rounded w-full"
                  type="email"
                  value={user?.email}
                  disabled
                />
              </div>
              <button
                onClick={updateUser}
                style={{ marginLeft: "38%" }}
                className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
                type="submit"
              >
                Change
              </button>
              <hr></hr>
              <PasswordChange></PasswordChange>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
