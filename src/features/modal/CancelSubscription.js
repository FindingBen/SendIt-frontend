import React, { useState, useEffect } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/LoaderSkeleton/Loader";
import { setContactLists } from "../../redux/reducers/contactListReducer";
import { useRedux } from "../../constants/reduxImports";

const CancelSubscription = ({ showModal, onClose, cancelConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [show, setShowModal] = useState(showModal);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelConfirm(); // Make sure sendConfirm returns a Promise!
      setLoading(false);
      closeModal();
    } catch (err) {
      setLoading(false);
    }
  };

  const closeModal = () => {
    onClose();
    setErrorMsg("");
  };
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
                  Cancelling subscription
                </span>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Are you sure you want to cancel your current subscription?
                  </p>
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-2 border-gray-800">
                  {loading ? (
                    <Loader color={true} loading_name={"Loading..."} />
                  ) : (
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
                        onClick={handleCancel}
                      >
                        Yes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default CancelSubscription;
