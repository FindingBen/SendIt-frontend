import React, { useEffect, useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate, useParams } from "react-router-dom";


const PasswordReset = () => {
  const axiosInstance = useAxiosInstance();
  const [email, setEmail] = useState();
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  let passReset = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
    };
    let response = await fetch(
      "http://localhost:8000/auth/users/reset_password/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body:JSON.stringify(formData),
      }
    );
      console.log("reset",response)
    if (response.status === 200 || response.status === 204) {
      //setTimeout(() => navigate("/login"), 5);
      setSent(true);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid mt-10">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <img
            src={require("../assets/IMG_2444.jpg")}
            className="img-fluid"
            alt="Sample image"
            style={{
              objectFit: "fill",
              width: "15%",
              height: "15%",
              marginLeft: "-12px",
            }}
          />
          <div className="col-12 mt-10">
            <h1 className="text-2xl font-bold mb-4">Enter your email</h1>
          </div>
          <div className="row">
            {!sent ? (
              <div style={{ paddingLeft: "30%", paddingRight: "30%" }}>
                <input
                  type="email"
                  className="bg-gray-800 hover:bg-green-400 mt-1 text-white py-2 px-4 border border-blue-700 rounded w-full"
                  placeholder="Enter your email"
                  onChange={handleEmail}
                ></input>
                <button
                  className="bg-sky-800 hover:bg-green-400 mt-1 text-white font-bold py-2 px-4 border border-blue-700 rounded w-25"
                  onClick={passReset}
                >
                  Reset
                </button>
              </div>
            ) : (
              <h2 className="text-1xl font-bold mb-4">
                Check your inbox, you should receive email shortly if you
                provided valid email address.
              </h2>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordReset;
