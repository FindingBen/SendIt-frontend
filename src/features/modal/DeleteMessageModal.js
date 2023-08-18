import React, { useState, useEffect } from "react";
import { selectCurrentToken } from "../../features/auth/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const DeleteMessageModal = ({
  messageId,
  showModalDelete,
  onClose,
  listUpdated,
  setUpdated,
}) => {
  const [show, setShowModal] = useState(showModalDelete);
  const [listUpdate, setListUpdate] = useState(listUpdated);
  const axiosInstance = useAxiosInstance();
  const params = useParams();

  useEffect(() => {
    setShowModal(showModalDelete);
  }, [showModalDelete]);
  console.log(messageId);
  let deleteMessage = async (e) => {
    //e.preventDefault();
    try {
      let response = await axiosInstance.delete(
        `/api/delete_message/${messageId}`
      );
      if (response.status === 200) {
        closeModal();
      }
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  };
  console.log(listUpdated);
  const closeModal = () => {
    onClose();
  };

  const setFunction = () => {
    deleteMessage();
    setUpdated();
  };

  return (
    <>
      {show ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Delete a message?</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to delete the message, this cant be reversed!
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    No
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={setFunction}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default DeleteMessageModal;
