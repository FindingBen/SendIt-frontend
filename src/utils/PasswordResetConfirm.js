import React, { useEffect, useState } from "react";
import useAxiosInstance from "./axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const axiosInstance = useAxiosInstance();
  const [pass, setPass] = useState();
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { uid, token } = useParams();
  const BASE_URL = "http://localhost:8000";
  const navigate = useNavigate();
  const handlePass = (e) => {
    setPass(e.target.value);
  };
  console.log(uid);
  let passReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      uid: uid,
      token: token,
      new_password: pass,
    };

    let response = await fetch(
      `${BASE_URL}/auth/users/reset_password_confirm/`,
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
      setLoading(false);
      setSent(true);
      navigate("/login");
    } else if (response.status === 400) {
      setErrMsg("Please provide new password!");
      setLoading(false);
    }
  };

  return (
    <section class="flex flex-col justify-center antialiased bg-darkBlue text-gray-200 min-h-screen p-4 w-100">
      <div class="h-full">
        <div class="max-w-[360px] mx-auto mt-20 mb-5">
          <div class="bg-white shadow-lg rounded-lg mt-9">
            <header class="text-center px-5 pb-5">
              <svg
                class="inline-flex -mt-9 w-[72px] h-[72px] rounded-full border-4 border-white box-content shadow mb-3"
                viewBox="0 0 72 72"
              >
                <path class="text-gray-700" d="M0 0h72v72H0z" />
                <image
                  href={require("../assets/notext-png.png")}
                  width="72"
                  height="72"
                />
              </svg>

              <h3 class="text-xl font-bold text-gray-900 mb-1">New password</h3>
              <div class="text-sm font-medium text-gray-500">
                Make sure you provide strong password!
              </div>
            </header>
            {errMsg && <p className="text-red-700">{errMsg}</p>}
            {!sent ? (
              <div class="bg-gray-100 mb-4 text-center px-5 py-6">
                <div class="shadow-sm rounded">
                  <div class="flex-none">
                    <input
                      onChange={handlePass}
                      name="username"
                      class="text-sm text-gray-800 bg-white placeholder-gray-400 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                      type="text"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="relative">
                    <svg
                      style={{ marginLeft: "45%" }}
                      aria-hidden="true"
                      className="w-8 h-8 mr-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 right-15"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={passReset}
                    type="submit"
                    class="font-semibold text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                  >
                    Send
                  </button>
                )}
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-500">
                Email has been sent, if its valid you should recieve a message
                with instructions
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetConfirm;
