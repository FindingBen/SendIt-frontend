import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectCurrentToken } from "../../features/auth/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";

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

      console.log(response);
      if (response.status === 200 || 201) {
        console.log("success");
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
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add a new contact to your list
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to add a new contact to this current list you
                    are visiting, remember to double check email and phone
                    records!
                  </p>
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="first_name"
                    type="text"
                    placeholder="First name"
                    onChange={handleFirstName}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                    onChange={handleLastName}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="phone_number"
                    type="text"
                    placeholder="Phone number"
                    onChange={handlePhoneNumber}
                  />
                  <input
                    className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="email"
                    placeholder="Email"
                    onChange={handleEmail}
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
                    onClick={addContact}
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

export default AddContactModal;
