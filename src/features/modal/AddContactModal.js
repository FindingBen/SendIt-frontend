import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentToken } from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useRedux } from "../../constants/reduxImports";
import { setContactLists } from "../../redux/reducers/contactListReducer";

const AddContactModal = ({ showModal, onClose, newContacts }) => {
  const { currentContactList, dispatch } = useRedux();
  const [show, setShowModal] = useState(showModal);
  const token = useSelector(selectCurrentToken);
  const [number, setNumber] = useState("");
  const params = useParams();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const axiosInstance = useAxiosInstance();

  const handleUserInput = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const addContact = async (e) => {
    e.preventDefault();
    try {
      let response = await axiosInstance.post(
        `/api/create_contact/${params.id}/`,
        {
          first_name: contact.firstName,
          last_name: contact.lastName,
          phone_number: number,
          email: contact.email,
          contact_list: params.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200 || 201) {
        newContacts((prevContacts) => [...prevContacts, response.data]);
        dispatch(setContactLists({ listChange: true }));
        closeModal();
      }
    } catch (error) {
      console.error(error);
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
            <div className="relative w-auto mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white/50 outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>Add a contact</Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-6 flex-auto mx-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to add a new contact to this current list you
                    are visiting, remember to double check email and phone
                    records! Remember to includ calling code as well( 45 ) or
                    which ever country to phone number is from
                  </p>
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    onChange={handleUserInput}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    onChange={handleUserInput}
                  />
                  <PhoneInput
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full"
                    placeholder="Enter phone number"
                    onChange={(e) => setNumber(e)}
                    defaultCountry="dk"
                    name="phoneNumber"
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    name="email"
                    placeholder="Email"
                    onChange={handleUserInput}
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
                    onClick={addContact}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default AddContactModal;
