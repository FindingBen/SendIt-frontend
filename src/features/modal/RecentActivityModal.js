import React, { useState, useEffect } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import Modal from "react-bootstrap/Modal";
import { useRedux } from "../../constants/reduxImports";

const RecentActivityModal = ({ showModal, onClose, activity }) => {
  const axiosInstance = useAxiosInstance();
  const { dispatch, currentContactList, currentUser } = useRedux();
  const [loading, setLoading] = useState(false);
  const [show, setShowModal] = useState(showModal);

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const closeModal = () => {
    onClose();
  };
  console.log("ACTIVATED", show);
  return (
    <>
      {show ? (
        <>
          <Modal
            show={show}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            <div className="relative w-auto max-w-3xl bg-ngrokGray">
              {/*content*/}
              <div className="relative flex flex-col rounded-xl w-full bg-ngrokGray">
                {/*header*/}
                <span className="text-2xl font-euclid p-6 text-slate-400">
                  {activity?.title ?? "No title"}
                </span>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {activity?.message ?? "No message"}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-2 border-gray-800">
                  <div className="flex flex-row gap-2">
                    <button
                      className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                      type="button"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default RecentActivityModal;
