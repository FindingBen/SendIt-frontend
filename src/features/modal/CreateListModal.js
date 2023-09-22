import React, { useState, useEffect } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../features/auth/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";


const CreateListModal = ({ showModal, onClose }) => {
  const axiosInstance = useAxiosInstance();
  const [show, setShowModal] = useState(showModal);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [listName, setListName] = useState();

  const handleListName = (e) => {
    setListName(e.target.value);
  };

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);
  console.log(listName);
  const addList = async (e) => {
    e.preventDefault();
    let response = await axiosInstance.post(
      `/api/create_list/${user}`,
      {
        list_name: listName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    if (response.status === 200 || 201) {
      closeModal();
    }
  };

  const closeModal = () => {
    onClose();
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
                  <h3 className="text-3xl font-semibold">
                    Add a new contact list
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Simply enter the name for the list and click create.
                  </p>

                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="text"
                    placeholder="List name"
                    onChange={handleListName}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={addList}
                  >
                    Add
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

export default CreateListModal;
