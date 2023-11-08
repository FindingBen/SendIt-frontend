import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UnsubscribePage = () => {
  const hashedNumber = useParams();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {}, [clicked]);

  const handleUnsubscribe = async () => {
    try {
      let response = await fetch(`/api/unsubscribe/${hashedNumber.id}`);

      if (response.status === 200) {
        setClicked(true);
        console.log("Unsubscribed");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen flex-d w-100 items-center justify-center bg-darkBlue">
      <div>
        {!clicked ? (
          <div className="p-10">
            <p className="text-white text-4xl mt-44">Opt-out</p>
            <p className="text-sm text-white mt-4">
              Are you sure you wish to unsubscribe from service?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="bg-blue-800 hover:bg-green-400 text-white font-bold py-2 px-3 rounded text-sm mt-5"
            >
              Yes please
            </button>
          </div>
        ) : (
          <div className="p-5 text-white flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-20 h-20 mt-44"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>

            <p className="mt-4">
              You unsubscribed from this service! You wont be getting any
              messages anymore.
            </p>
            <br></br>
            <p className="text-sm">You can exit this page.</p>
          </div>
        )}
      </div>
      <p className="text-white opacity-60 font-light text-sm">
        © 2023 by Sendperplane
      </p>
    </div>
  );
};

export default UnsubscribePage;
