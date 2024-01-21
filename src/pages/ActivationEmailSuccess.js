import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { config } from "../constants/Constants";

const ActivationEmailSuccess = () => {
  const BASE_URL = config.url.BASE_URL;
  const params = useParams();
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    activateEmail();
  }, []);

  let activateEmail = async () => {
    if (isActivated === false) {
      try {
        let response = await fetch(
          `${BASE_URL}/api/confirmation_token/${params.token_id}/${params.user_id}`
        );
        if (response.status === 200 || response.status === 201) {
          setIsActivated(true);
        }
      } catch (error) {}
    }
  };

  return (
    <div className="min-h-screen flex-d w-100 items-center justify-center bg-darkBlue">
      <div className="p-10 flex-1">
        <div className="mt-10">
          <p className="text-white font-normal text-2xl">
            Your email is now verified and activated, you can login now.
          </p>
          <Link
            to={"/login"}
            className="text-white/50 font-normal text-xl hover:text-blue-900 duration-200"
          >
            Back to login
          </Link>
        </div>
      </div>
      <p className="text-white opacity-60 font-light text-sm">
        © 2023 by Sendperplane
      </p>
    </div>
  );
};

export default ActivationEmailSuccess;
