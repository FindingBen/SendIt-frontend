import React, { useState, useEffect } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../features/auth/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

const CreateListModal = ({ showModal, onClose, newList }) => {
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
      newList((prevList) => [...prevList, response.data]);
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
          <Modal
            show={show}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            <div className="relative w-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>Create a new list</Modal.Title>
                </Modal.Header>
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
                    className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={addList}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default CreateListModal;
