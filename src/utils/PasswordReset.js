import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { config } from "../constants/Constants";

const PasswordReset = () => {
  const [email, setEmail] = useState();
  const [sent, setSent] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = config.url.BASE_URL;

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  let passReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      email: email,
    };
    try {
      let response = await fetch(`${baseURL}/auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200 || response.status === 204) {
        //setTimeout(() => navigate("/login"), 5);
        setLoading(false);
        setSent(true);
      }
    } catch (e) {
      console.log(e);
      setErrMsg("Error, contact support if it persists!");
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center bg-[#0A0E1A] text-gray-200 min-h-screen p-4 w-full">
  <div className="flex-1 flex flex-col items-center justify-center">
    <div className="max-w-[360px] w-full mt-20">
      <div className="bg-[#111827] border-2 border-gray-800 shadow-lg rounded-2xl">
        {/* Header */}
        <header className="text-center px-5 pt-5 pb-4 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-1">Enter your email below</h3>
          <p className="text-sm text-white/50">
            To reset your password, enter your email and we will send you a link.
          </p>
        </header>

        {/* Form */}
        {!sent ? (
          <div className="px-5 py-6 flex flex-col gap-4">
            {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}

            <input
              onChange={handleEmail}
              name="email"
              type="text"
              placeholder="Email"
              className="w-full p-2 rounded-xl border-2 border-gray-700 focus:outline-none text-gray-300 bg-[#1B2233]"
            />

            {loading ? (
              <div className="flex justify-center mt-2">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
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
                className="w-full py-2 rounded-xl bg-ngrokBlue hover:bg-ngrokBlue/70 text-white text-sm transition-all mt-2"
              >
                Send
              </button>
            )}
          </div>
        ) : (
          <div className="px-5 py-6 text-center">
            <p className="text-white/50 text-sm">
              Email has been sent! If valid, you will receive instructions. Check your inbox and spam folder.
            </p>
          </div>
        )}
      </div>

      {/* Back to login */}
      <p className="mt-4 text-center text-gray-300">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  </div>
</section>

  );
};

export default PasswordReset;
