import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../constants/Constants";
import LoaderComponent from "../components/LoaderComponent";

const PasswordResetConfirm = () => {
  const [pass, setPass] = useState();

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const { uid, token } = useParams();
  const baseURL = config.url.BASE_URL;
  const navigate = useNavigate();

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  let passReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      uid: uid,
      token: token,
      new_password: pass,
    };

    let response = await fetch(
      `${baseURL}/auth/users/reset_password_confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.status === 204) {
      setLoading(false);
      setChanged(true);
    } else if (response.status === 400) {
      setErrMsg("Please provide new password!");
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center antialiased bg-gradient-to-b from-lighterMainBlue to-mainBlue text-gray-200 min-h-screen p-4 w-100">
      <div className="flex-1">
        <div className="max-w-[360px] mx-auto mt-20 mb-5">
          <div className="bg-navBlue border-2 border-gray-800 h-[420px] rounded-lg mt-3">
            <header className="text-center px-5 pb-5">
              {!changed ? (
                <div className="flex flex-col mt-3">
                  <h3 className="text-xl font-bold text-gray-200 mb-4">
                    New password
                  </h3>
                  <div className="text-sm font-medium text-gray-500">
                    Make sure you provide strong password!
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Password changed
                  </h3>
                  <div className="text-sm font-medium text-gray-500">
                    You can close this page now.
                  </div>
                </div>
              )}
            </header>
            {errMsg && <p className="text-red-700">{errMsg}</p>}

            {!changed ? (
              <div className="bg-navBlue mb-4 text-center px-5 py-6">
                <div className="rounded">
                  <div className="flex-none">
                    <input
                      onChange={handlePass}
                      name="username"
                      className="text-sm text-gray-800 bg-white placeholder-gray-400 rounded-xl p-2 w-full border border-transparent focus:border-indigo-300 focus:ring-0"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="relative mx-auto items-center">
                    <LoaderComponent className="mx-auto" />
                  </div>
                ) : (
                  <button
                    onClick={passReset}
                    type="submit"
                    className="font-normal text-sm mt-2 inline-flex items-center justify-center px-3 py-2 rounded-xl leading-5 shadow-lg transition duration-150 ease-in-out w-full bg-purpleHaze hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 mb-4 text-center px-5 py-6"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetConfirm;
