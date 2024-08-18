import React, { useState, useEffect } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import Modal from "react-bootstrap/Modal";
import { setMessages } from "../../redux/reducers/messageReducer";
import { useRedux } from "../../constants/reduxImports";

const ReDraftModal = ({
  messageId,
  showReDraft,
  onClose,
  listUpdated,
  setUpdated,
}) => {
  const [show, setShowModal] = useState(showReDraft);
  const { dispatch } = useRedux();
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    setShowModal(showReDraft);
  }, [showReDraft]);

  const updateStatus = async () => {
    const body = {
      status: "Draft",
    };
    try {
      let response = await axiosInstance.put(
        `api/message_view_edit/${messageId}/`,
        body
      );
    
      if (response.status === 200 || 201) {

        onClose();
        setUpdated(true);
      }
    } catch (error) {}
  };

  const closeModal = () => {
    onClose();
  };

  const setFunction = () => {
    updateStatus();
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
            <div className="relative w-automx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className="flex flex-row">
                      <p>Re-draft message</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 ml-2 mt-2"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-4 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to re draft this content, are you sure?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-3 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={closeModal}
                  >
                    No
                  </button>

                  <button
                    className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={setFunction}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          {/* <div className="opacity-25 fixed inset-0 z-40 bg-black"></div> */}
        </>
      ) : null}
    </>
  );
};

export default ReDraftModal;
