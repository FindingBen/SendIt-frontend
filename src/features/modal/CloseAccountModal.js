import React, { useState, useEffect, useRef } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import Modal from "react-bootstrap/Modal";
import { logOut } from "../../redux/reducers/authSlice";
import { useSelector } from "react-redux";
import { useRedux } from "../../constants/reduxImports";

const CloseAccountModal = ({ showModal, onClose }) => {
  const axiosInstance = useAxiosInstance();
  const { dispatch } = useRedux();
  const [show, setShowModal] = useState(showModal);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(null); // Countdown state
  const [cancelClicked, setCancelClicked] = useState(false);
  const intervalRef = useRef(null); // Use ref for interval

  useEffect(() => {
    setShowModal(showModal);
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [showModal]);

  const closeAccount = async (e) => {
    const body = {
      is_active: false,
    };
    try {
      let response = await axiosInstance.put(
        `/api/update_user/${user}/`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      if (response.status === 200 || 201) {
        console.log(response);
        closeModal();
        dispatch(logOut());
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      setErrorMsg(errorMsg);
    }
  };

  const closeModal = () => {
    onClose();
    setErrorMsg("");
    setCountdown(null);
    clearInterval(intervalRef.current); // Clear interval when modal closes
  };

  const startCountdown = () => {
    let timeLeft = 5;
    setCountdown(timeLeft);

    intervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(intervalRef.current);
        closeAccount();
      }
    }, 1000);
  };

  const cancelCountdown = () => {
    clearInterval(intervalRef.current); // Stop the interval immediately
    setCountdown(null); // Reset the countdown display
  };

  return (
    <>
      {show ? (
        <Modal
          show={show}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
          <div className="relative w-auto max-w-3xl rounded-2xl">
            <div className="relative flex flex-col w-full bg-ngrokGray">
              <span className="text-2xl font-euclid p-6 text-slate-400">
                Close your account
              </span>
              <div className="relative p-6 flex-auto">
                {countdown === null ? ( // Show initial message or countdown
                  <>
                    <p className="my-4 text-slate-500 text-lg leading-relaxed font-euclid">
                      You are about to permanently close your account. This
                      action is irreversible!
                      <br />
                      Are you sure?
                    </p>
                    {errorMsg && (
                      <p className="text-sm text-red-500">{errorMsg}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      You will be logged out in {countdown} seconds...
                    </p>
                    <button
                      className="bg-ngrokBlue hover:bg-blue-400 text-white font-euclid py-2 px-4 rounded duration-200"
                      onClick={cancelCountdown}
                    >
                      Cancel Logout
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {countdown === null &&
                  !cancelClicked && ( // Show buttons only if countdown hasn't started
                    <div className="flex flex-row gap-2">
                      <button
                        className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                        type="button"
                        onClick={closeModal}
                      >
                        No
                      </button>
                      <button
                        className="bg-ngrokBlue hover:bg-blue-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                        type="button"
                        onClick={startCountdown}
                      >
                        Yes
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default CloseAccountModal;
