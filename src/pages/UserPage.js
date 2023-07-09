import React, { useEffect, useState } from "react";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const [username, setUsername] = useState();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    //setUser(jwtDecode(token));
  }, []);

  const handleUser = (e) => setUsername(e.target.value);

  const handleOldPass = (e) => setOldPassword(e.target.value);

  const handleNewPass = (e) => setNewPassword(e.target.value);

  const handleNewName = (e) => setNewName(e.target.value);

  const handleNewLastName = (e) => setNewLastName(e.target.value);

  let getUser = async () => {
    let response = await axiosInstance.get(
      `http://127.0.0.1:8000/api/user_account/${params.id}/`,
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
  };

  let updateUser = async (e) => {
    e.preventDefault();
    const formData = {
      username: username,
      first_name: newName,
      last_name: newLastName,
    };

    let response = await axiosInstance.put(
      `http://127.0.0.1:8000/api/update_user/${params.id}/`,
      formData,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    console.log(response);
    if (response.status === 200) {
      console.log("success");
      navigate("/home");
    }
  };

  let changePass = async () => {
    const formData = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      let response = await axiosInstance.put(
        "http://127.0.0.1:8000/api/change_password/",
        formData,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      console.log(formData);
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 m">
              <h1 className="text-3xl font-bold mb-4">Account information</h1>
              <hr></hr>
            </div>
            <div className="grid gap-3 w-50 mt-4" style={{ marginLeft: "25%" }}>
              <div>
                <label
                  for="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
                  value={newName}
                  onChange={handleNewName}
                />
              </div>
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-full"
                  placeholder="Doe"
                  value={newLastName}
                  onChange={handleNewLastName}
                />
              </div>
              <div>
                <label
                  for="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-full"
                  placeholder="Doe"
                  value={username}
                  onChange={handleUser}
                />
              </div>
              <div className="mb-6">
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email address
                </label>
                <input
                  className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
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
              <h2 className="text-2xl font-bold mb-4 mt-4">Change password</h2>
              <input
                className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                type="password"
                onChange={handleOldPass}
                placeholder="Enter old password"
              />
              <input
                className="bg-gray-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                type="password"
                onChange={handleNewPass}
                placeholder="Enter new password"
              />
              <button
                style={{ marginLeft: "38%" }}
                className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
                onClick={changePass}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
