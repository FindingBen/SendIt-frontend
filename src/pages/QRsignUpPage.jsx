import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRedux } from "../constants/reduxImports";
import { setContactLists } from "../redux/reducers/contactListReducer";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { config, statements } from "../constants/Constants";
import LoaderComponent from "../components/LoaderComponent";

const QRsignUpPage = () => {
  const { dispatch } = useRedux();
  const [errMsg, setErrMsg] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [canSign, setCanSign] = useState(false);
  const baseURL = config.url.BASE_URL;
  const TRUE = statements.TRUE;
  const FALSE = statements.FALSE;
  const params = useParams();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    setSuccess(false);
    setErrMsg(null);
  }, [contact]);

  useEffect(() => {
    canUserSignUp();
  }, []);

  const canUserSignUp = async (e) => {
    try {
      setLoader(true);
      let response = await axios.get(
        `${baseURL}/api/qr_check_sign/${params.id}`
      );
      let data = response.data;
      if (data.can_sign_up === TRUE) {
        setCanSign(true);
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      } else {
        setCanSign(false);
        setTimeout(() => {
          setLoader(false);
        }, 2000);
      }
    } catch (error) {
      setCanSign(false);
      setLoader(false);
    }
  };

  const handleUserInput = (e) => {
    setContact({ ...contact, [e.target?.name]: e.target?.value });
  };

  const signUpCustomer = async (e) => {
    e.preventDefault();

    if (!contact.firstName || !number) {
      setErrMsg("First name and phone number are required.");
      return;
    }

    setLoading(true); // Show loader
    setErrMsg(null); // Reset error message
    try {
      let response = await axios.post(
        `${baseURL}/api/create_contact_qr/${params.id}`,
        {
          first_name: contact?.firstName,
          last_name: contact?.lastName,
          phone_number: number,
        }
      );
      if (response.status === 200 || 201) {
        setSuccess(true);
        dispatch(
          setContactLists({
            contactLists: [],
            listChange: true,
          })
        );
      }
    } catch (error) {
      setSuccess(false);
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="min-h-screen w-100 items-center bg-mainBlue relative">
      {!success ? (
        <div className="flex flex-col items-center p-4 gap-7">
          <p className="text-3xl text-white text-center">Welcome to Business</p>

          {errMsg && (
            <p className="text-red-500 font-semibold text-center">{errMsg}</p>
          )}
          {!loader ? (
            <>
              {canSign ? (
                <>
                  <p className="text-white/75 font-semibold text-center">
                    Please enter your details below to join our promotion list!
                  </p>
                  <div className="flex flex-col mx-auto gap-2">
                    <div className="flex flex-col text-center gap-2 mx-auto">
                      <div className="flex flex-col justify-center w-full">
                        <p className="text-white/75 font-semibold">
                          First Name
                        </p>
                        <input
                          name="firstName"
                          onChange={handleUserInput}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <p className="text-white/75 font-semibold">Last Name</p>
                        <input
                          name="lastName"
                          onChange={handleUserInput}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-center w-full">
                        <p className="text-white/75 font-semibold">
                          Phone number
                        </p>
                        <PhoneInput
                          className="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-xl p-2 block w-full"
                          placeholder="Enter phone number"
                          onChange={(e) => setNumber(e)}
                          name="phoneNumber"
                        />
                      </div>
                    </div>
                    {!loading ? (
                      <button
                        onClick={signUpCustomer}
                        disabled={loading} // Disable button while loading
                        className={`px-2 py-2 w-[30%] mt-2 md:w-[25%] text-xs md:text-normal rounded-lg text-white mx-28 ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-cyan-700"
                        }`}
                      >
                        Sign me up
                      </button>
                    ) : (
                      <LoaderComponent></LoaderComponent>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-white/75 font-semibold">
                  Ohh it seems like the list is currently full..
                </p>
              )}
            </>
          ) : (
            <div>
              {/* <p className="text-white/75 font-semibold">
                Ohh it seems like the list is currently full..
              </p> */}
              <LoaderComponent />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 gap-4">
          <p className="text-3xl text-green-500 font-bold text-center">
            Thank you for signing up!
          </p>
          <p className="text-white/75 text-center">
            We will send some exciting stuff on your way soon!
          </p>
        </div>
      )}
      <p className="text-white opacity-60 font-light text-sm text-center bottom-0">
        © 2024 by Sendperplane
      </p>
    </div>
  );
};

export default QRsignUpPage;
