import React,{useEffect,useState} from 'react'
import Modal from "react-bootstrap/Modal";

const OptimizeProductModal = ({showModal, onClose, awaitOptimize}) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [show, setShowModal] = useState(showModal);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  // Smooth fake-progress animation
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }

    let interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + 2; // slow climb
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  const closeModal = () => {
    onClose();
    setErrorMsg("");
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      await awaitOptimize();
      setProgress(100); // instantly complete
      setTimeout(() => {
        setLoading(false);
        closeModal();
      }, 500);
    } catch (err) {
      setLoading(false);
    }
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
          <div className="relative w-auto max-w-3xl bg-ngrokGray">
            <div className="relative flex flex-col rounded-xl w-full bg-ngrokGray">

              {/* HEADER */}
              <span className="text-2xl font-euclid p-6 text-slate-300">
                Product optimization confirmation
              </span>

              {/* BODY */}
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-slate-400 text-lg leading-relaxed">
                  You are about to optimize your product. Do you wish to proceed?
                </p>
                {errorMsg && (
                  <p className="text-sm text-red-500">{errorMsg}</p>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-end p-6 border-t border-2 border-gray-800">

                {loading ? (
                  <div className="w-full">
                    <p className="text-gray-400 text-sm mb-2 tracking-wide">
                      Optimizing your product… {progress}%
                    </p>

                    {/* Progress bar container */}
                    <div className="w-full h-3 bg-[#1b1c27] rounded-full overflow-hidden border border-[#23253a]">
                      {/* Progress bar fill */}
                      <div
                        className="h-full bg-gradient-to-r from-[#3e6ff4] to-[#6e8fff] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
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
                      onClick={handleOptimize}
                    >
                      Optimize
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

export default OptimizeProductModal;
