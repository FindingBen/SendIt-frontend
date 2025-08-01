import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/LoaderSkeleton/Loader";
import Modal from "react-bootstrap/Modal";
import useAxiosInstance from "../../utils/axiosInstance";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useRedux } from "../../constants/reduxImports";
import { setContactLists } from "../../redux/reducers/contactListReducer";
import { setUserInfo } from "../../redux/reducers/userReducer";

const AddContactModal = ({ showModal, onClose, newContacts }) => {
  const { currentTokenType, dispatch, currentShopifyToken } = useRedux();
  const [show, setShowModal] = useState(showModal);
  const [number, setNumber] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const axiosInstance = useAxiosInstance();

  const handleUserInput = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const addContact = async (e) => {
    setLoading(true);
    e.preventDefault();
    const errors = {};
    if (!contact.firstName.trim()) errors.firstName = "First name is required.";
    if (!contact.lastName.trim()) errors.lastName = "Last name is required.";
    if (!number.trim()) errors.phone = "Phone number is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }
    try {
      const payload = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: number,
        email: contact.email,
      };

      // Add `contact_list` only if `currentTokenType` is not Shopify
      if (currentShopifyToken === "None") {
        payload.contact_list = params.id;
      }

      let response = await axiosInstance.post(
        `/api/create_contact/${params.id}/`,
        payload
      );

      if (response.status === 200 || 201) {
        setLoading(false);
        newContacts((prevContacts) => [...prevContacts, response.data]);
        dispatch(
          setContactLists({
            contactLists: [],
            listChange: true,
          })
        );
        // dispatch(setUserInfo({ shopify_connect: true }));
        closeModal();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.data.details) {
        const errors = error.response.data.details.reduce((acc, err) => {
          const field = err.field[0];
          acc[field] = err.message;
          setErrMsg("");
          return acc;
        }, {});
        setFieldErrors(errors);
      } else {
        setErrMsg(error.response?.data?.detail || "Something went wrong");
      }
    }
  };
  const closeModal = () => {
    setContact({ firstName: "", lastName: "", email: "", phone: "" });
    setNumber("");
    setFieldErrors({});
    setErrMsg("");
    setLoading(false);
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
            {/*content*/}
            <div className="relative border-2 border-gray-800 flex flex-col w-full bg-ngrokGray">
              {/*header*/}
              <span className="text-2xl font-euclid p-6 text-slate-400">
                Add contact
              </span>
              {/*body*/}
              <div className="relative p-6 flex-auto mx-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed font-euclid">
                  Remember to double check email and phone records!
                </p>
                <input
                  className={`bg-gray-50 border ${
                    fieldErrors?.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  } mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full`}
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  onChange={handleUserInput}
                />
                {fieldErrors?.firstName && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors?.firstName}
                  </p>
                )}
                <input
                  className={`bg-gray-50 border ${
                    fieldErrors?.lastName ? "border-red-500" : "border-gray-300"
                  } mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full`}
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  onChange={handleUserInput}
                />
                {fieldErrors?.lastName && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors?.lastName}
                  </p>
                )}
                <PhoneInput
                  className={`bg-gray-50 border ${
                    fieldErrors?.phone ? "border-red-500" : "border-gray-300"
                  } mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full`}
                  placeholder="Enter phone number"
                  onChange={(e) => setNumber(e)}
                  defaultCountry={undefined}
                  name="phoneNumber"
                />
                {fieldErrors?.phone && (
                  <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
                )}
                <input
                  className={`bg-gray-50 border ${
                    fieldErrors?.email ? "border-red-500" : "border-gray-300"
                  } mt-2 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  name="email"
                  placeholder="Email"
                  onChange={handleUserInput}
                />
                {fieldErrors?.email && (
                  <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                )}
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {errMsg && (
                  <p className="text-red-700 font-semibold text-normal text-start">
                    {errMsg}
                  </p>
                )}
                {loading ? (
                  <Loader color={true} loading_name={"Loading..."} />
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
                      onClick={addContact}
                    >
                      Create
                    </button>
                  </div>
                )}
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
