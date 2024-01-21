import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
import "../css/Sms.css";
import TextComponent from "../components/TextComponent";
import SmsConfirmModal from "../features/modal/SmsConfirmModal";
import { useRedux } from "../constants/reduxImports";

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentPackageState } = useRedux();
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [user, setUser] = useState();
  const [dateSchedule, setDateSchedule] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const textComponentRef = useRef(null);
  const [recipients, setRecipients] = useState();
  const BASE = "https://sendit-backend-production.up.railway.app";
  const BASE_URL = "https://spplane.app";
  const linkURLBase = `${BASE_URL}/view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/tracking/`;
  const maxCharacters = 70;
  useEffect(() => {
    getContactLists();
    getUser();
  }, []);

  useEffect(() => {
    setErrorMessage("");

    try {
      if (textComponentRef.current) {
        setTimeout(() => {
          ReactDOM?.render(
            <TextComponent textValue={smsText} />,
            textComponentRef.current
          );
        }, 5);
      }
    } catch (error) {
      console.error(error);
    }
  }, [smsText, textComponentRef, isDropdownOpen]);

  const getUser = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/user_account/${currentUser}/`
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {}
  };

  const handleAddLink = () => {
    const linkEmbed = ` #Link `;
    const textarea = document.getElementById("smsTextArea");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    setLinkURL(linkURLBase);

    // Ensure smsText is not null or undefined
    if (typeof smsText === "string") {
      // Insert the link at the specified index
      setSmsText(
        smsText.substring(0, startPos) + linkEmbed + smsText.substring(endPos)
      );
    } else {
      // Handle the case where smsText is not a string (e.g., null, undefined)
      setSmsText(linkEmbed);
    }
  };

  const handleNameLink = () => {
    const linkEmbed = ` #FirstName `;
    const textarea = document.getElementById("smsTextArea");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Ensure smsText is not null or undefined
    if (typeof smsText === "string") {
      // Insert the link at the specified index
      setSmsText(
        smsText.substring(0, startPos) + linkEmbed + smsText.substring(endPos)
      );
    } else {
      // Handle the case where smsText is not a string (e.g., null, undefined)
      setSmsText(linkEmbed);
    }
  };

  const handleSms = (e) => {
    setSmsText(e.target.value);
  };

  const sendSms = async () => {
    try {
      const response = await axiosInstance.post("/sms/sms-send/", {
        user: currentUser,
        sender: "ME",
        sms_text: smsText,
        content_link: linkURL,
        message: params.id,
        contact_list: recipients.id,
        scheduled: false,
        // is_sent: true,
      });

      if (response.status === 200 || response.status === 201) {
        navigate(`/home`);
      } else {
        setErrorMessage("Error sending SMS");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error sending SMS");
      console.error(error);
    }
  };

  const scheduleSms = async () => {
    try {
      let response = await axiosInstance.post("/sms/sms-send-schedule/", {
        user: currentUser,
        sender: "ME",
        sms_text: smsText,
        content_link: uniqueLink,
        message: params.id,
        contact_list: recipients.id,
        scheduled_time: dateSchedule,
        scheduled: true,
        is_sent: false,
      });
      if (response.status === 200 || 201) {
        navigate(`/home`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        setContactList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (e) => {
    if (e.target.value !== "Choose") {
      const recipientData = JSON.parse(e.target.value);
      setRecipients(recipientData);
    }
  };

  const canScheduleSms = () => {
    if (currentPackageState === "Basic package") {
      return false;
    }
    return true;
  };

  const handleDate = (date) => {
    setDateSchedule(date);
  };

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center mb-3">
            <h3 class="text-3xl text-left font-extralight text-white">
              Sms credit: {user?.sms_count}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-md">
            <div className="grid gap-2 bg-darkestGray rounded-lg">
              <div class="rounded p-10">
                <h3 class="text-2xl text-left font-extralight text-white mb-4">
                  Sms send
                </h3>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white"
                  >
                    From:
                  </label>

                  <input
                    type="text"
                    name="from"
                    disabled
                    value={"(+1) 2012550867"}
                    className="block bg-gray-600 mt-1 text-light font-light py-2 px-4 rounded w-50"
                  />
                </div>

                <div>
                  <label className="block mb-2 mt-4 text-sm text-left font-medium text-gray-300 dark:text-white">
                    Select contact list:
                  </label>

                  <select
                    className="block bg-gray-300 w-50 text-gray-700 divide-y divide-gray-100 rounded-lg"
                    onChange={handleChoice}
                  >
                    <option value={"Choose"}>Choose your list</option>
                    {contactLists?.map((item) => (
                      <option
                        key={item.id}
                        value={JSON.stringify(item)}
                        className="text-gray-700"
                      >
                        {item.list_name}
                      </option>
                    ))}
                  </select>
                </div>
                <br></br>
                <div className="form-group purple-border text-gray-100 rounded-lg">
                  <label className="block mb-2 text-sm text-left font-medium text-gray-300 dark:text-white">
                    Sms text:
                  </label>

                  <div className="relative">
                    <textarea
                      id="smsTextArea"
                      maxLength={maxCharacters}
                      className="block p-2.5 h-2/4 w-[65%] text-sm text-gray-50 bg-gray-400 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Write your sms here..."
                      onChange={handleSms}
                      value={smsText}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-row">
                      <button
                        onClick={() => {
                          setShow(true);
                        }}
                        type="submit"
                        color="dark"
                        className="bg-green-800 hover:bg-green-400 text-white font-normal py-2 px-3 rounded text-sm xl:text-base mt-4"
                        disabled={
                          user &&
                          recipients &&
                          user.sms_count < recipients.contact_length
                        }
                      >
                        Send
                      </button>

                      {canScheduleSms() ? (
                        <button
                          onClick={() => setShowSchedule(true)}
                          type="submit"
                          color="dark"
                          className="bg-yellow-700 hover:bg-yellow-300 text-white font-normal py-2 px-3 rounded text-sm xl:text-base mt-4 ml-3"
                        >
                          Schedule
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {errorMessage && (
                <div
                  class="mx-5 p-4 mb-4 h-20 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-2"
                  role="alert"
                >
                  <span class="font-medium">Sms send error!</span>{" "}
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="col mt-3">
              <p className="text-3xl font-extralight text-white">
                Sms Configuration
              </p>
              <div className="font-extralight text-white p-5">
                You picked up a list of{" "}
                <p className="text-white inline-block font-bold">
                  {recipients?.contact_lenght ?? 0}
                </p>{" "}
                recipients which means you will get deducted{" "}
                <p className="text-white inline-block font-bold">
                  {recipients?.contact_lenght ?? 0}
                </p>{" "}
                message credits. Your new credit statement will be{" "}
                <p className="text-white inline-block font-bold">
                  {user?.sms_count - recipients?.contact_lenght}
                </p>{" "}
                after this sendout.
              </div>
              <div className="flex flex-col p-5 rounded-lg">
                <div className="flex flex-row p-2">
                  <p className="font-extralight text-white">
                    Link your campaign{" "}
                  </p>
                  <button
                    onClick={handleAddLink}
                    value={linkURLBase}
                    disabled={smsText.length === 0 || !recipients}
                    className={`${
                      smsText.length === 0 || !recipients
                        ? "bg-gray-500"
                        : "bg-blue-800 cursor-pointer"
                    } hover:bg-blue-400 text-white font-bold py-2 px-3 rounded text-sm xl:text-base ml-2`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-row p-2">
                  <p className="font-extralight text-white">
                    Personalize your sending{" "}
                  </p>
                  <button
                    onClick={handleNameLink}
                    disabled={smsText.length === 0 || !recipients}
                    className={`${
                      smsText.length === 0 || !recipients
                        ? "bg-gray-500"
                        : "bg-blue-800 cursor-pointer"
                    } hover:bg-blue-400 text-white font-bold py-2 px-3 rounded text-sm xl:text-base ml-2`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <SmsConfirmModal
              // recipientNumber={}
              sendConfirm={sendSms}
              showModal={show}
              onClose={() => setShow(false)}
            ></SmsConfirmModal>
            <ScheduleSmsModal
              sendConfirm={scheduleSms}
              showModal={showSchedule}
              dateSchedule={handleDate}
              onClose={() => setShowSchedule(false)}
            ></ScheduleSmsModal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmsEditor;
