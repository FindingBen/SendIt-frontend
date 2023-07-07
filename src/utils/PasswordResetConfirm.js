import React, { useEffect, useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const axiosInstance = useAxiosInstance();
  const [pass, setPass] = useState();
  const [sent, setSent] = useState(false);
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const handlePass = (e) => {
    setPass(e.target.value);
  };
  console.log(uid);
  let passReset = async (e) => {
    e.preventDefault();
    const formData = {
      uid: uid,
      token: token,
      new_password: pass,
    };
    let response = await fetch(
      `http://localhost:8000/auth/users/reset_password_confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(response);
    if (response.status === 204) {
      console.log("success");
      setSent(true);
      navigate("/login");
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <h2 className="text-2xl font-bold mb-4">Enter your new password</h2>
          <div>
            <input
              type="password"
              className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
              placeholder="Enter your new password"
              onChange={handlePass}
            ></input>
            <button
              className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
              onClick={passReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetConfirm;
