import React, { useState, useEffect } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/LoaderSkeleton/Loader";
import { useRedux } from "../../constants/reduxImports";
import ProgressImport from "../../components/Progress/ProgressImport";


const BusinessRulesetModal = ({ showModal, onClose, createRuleset }) => {
    const axiosInstance = useAxiosInstance();
  const { dispatch, currentUser } = useRedux();
  const [loading, setLoading] = useState(false);
  const [show, setShowModal] = useState(showModal);
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();


    useEffect(() => {
      setShowModal(showModal);
    }, [showModal]);

const handleConfirm = async () => {
  setLoading(true);
  setProgress(5);

  // Simulate progress animation while waiting for API
  const interval = setInterval(() => {
    setProgress((old) => {
      if (old >= 90) return old; // Prevent reaching 100% too early
      return old + 8;
    });
  }, 300);

  try {
    await createRuleset();
    clearInterval(interval);

    // Finish the bar
    setProgress(100);

    setTimeout(() => {
      setLoading(false);
      closeModal();
      setProgress(0);
    }, 600);
  } catch (err) {
    clearInterval(interval);
    setLoading(false);
    setProgress(0);
  }
};


    const closeModal = () => {
    onClose();
    setErrorMsg("");
  };


  const interval = setInterval(() => {
    setProgress((old) => {
      if (old >= 90) return old; // Prevent reaching 100% too early
      return old + 8;
    });
  }, 300);

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
                  Business ruleset activation
                </span>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Confirm the creation of ruleset which will apply across your products. This will help maintain SEO reccomedetions, autoupdates and other values for your products<br></br>
                    Are you sure you want to proceed?
                  </p>
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                  
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-2 border-gray-800 w-full">
  {loading ? (
    <div className="w-full flex flex-col items-center">
      <p className="text-gray-300 font-euclid mb-2 text-sm">
        Creating business ruleset...
      </p>
      <ProgressImport progress={progress} />
    </div>
  ) : (
    <div className="flex flex-row gap-2">
      <button
        className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
        type="button"
        onClick={closeModal}
      >
        Close
      </button>
      <button
        className="bg-ngrokBlue hover:bg-blue-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
        type="button"
        onClick={handleConfirm}
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
  )
}

export default BusinessRulesetModal