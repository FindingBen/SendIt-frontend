import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentToken } from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

const AddContactModal = ({ showModal, onClose, newContacts }) => {
  const [show, setShowModal] = useState(showModal);
  const token = useSelector(selectCurrentToken);
  const params = useParams();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
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
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          email: email,
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
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    onChange={handleFirstName}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    onChange={handleLastName}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm  rounded-xl w-full p-2.5 "
                    name="phone_number"
                    type="text"
                    placeholder="Phone number"
                    onChange={handlePhoneNumber}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    name="email"
                    placeholder="Email"
                    onChange={handleEmail}
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
