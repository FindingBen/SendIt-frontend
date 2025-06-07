import React, { useState, useEffect } from "react";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/LoaderSkeleton/Loader";
import { setContactLists } from "../../redux/reducers/contactListReducer";
import { useRedux } from "../../constants/reduxImports";

const CreateListModal = ({ showModal, onClose, newList }) => {
  const axiosInstance = useAxiosInstance();
  const { dispatch, currentContactList, currentUser } = useRedux();
  const [loading, setLoading] = useState(false);
  const [show, setShowModal] = useState(showModal);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [errorMsg, setErrorMsg] = useState("");
  const [listName, setListName] = useState();

  const handleListName = (e) => {
    setListName(e.target.value);
    setErrorMsg("");
  };

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const addList = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      let response = await axiosInstance.post(
        `/api/contact_lists/`,
        {
          list_name: listName,
          user_id: currentUser,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200 || 201) {
        setLoading(false);
        const newListData = [...currentContactList.contactLists, response.data];
        newList(newListData);
        dispatch(
          setContactLists({ contactLists: newListData, listChange: true })
        );
        closeModal();
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg(error);

      if (error) {
        setLoading(false);
        setErrorMsg("This field cannot be empty!");
      }
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
            <div className="relative w-auto max-w-3xl rounded-2xl">
              {/*content*/}
              <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>Create a new list</Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Simply enter the name for the list and click create.
                  </p>
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    name="text"
                    placeholder="List name"
                    onChange={handleListName}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  {loading ? (
                    <Loader color={true} loading_name={"Loading..."} />
                  ) : (
                    <div>
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

export default CreateListModal;
