import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
import "../css/Sms.css";
import SmsConfirmModal from "../features/modal/SmsConfirmModal";
import { useRedux } from "../constants/reduxImports";
import { setOperation } from "../redux/reducers/messageReducer";
import SmsPill from "../components/SmsPill/SmsPill";
import Checklist from "../components/Checklist/Checklist";

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentPackageState, dispatch } = useRedux();
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [user, setUser] = useState();
  const [dateSchedule, setDateSchedule] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const [islist, setIslist] = useState(false);
  const [istext, setIsText] = useState(false);
  const [isName, setIsname] = useState(false);
  const [isLink, setIslink] = useState(false);
  const [recipients, setRecipients] = useState();
  const BASE = "https://spp.up.railway.app";
  const BASE_URL = "https://spplane.app";
  const linkURLBase = `${BASE_URL}/view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/tracking/`;
  const maxCharacters = 100;

  useEffect(() => {
    getContactLists();
    getUser();
  }, []);

  useEffect(() => {
    if (!smsText.includes("#Link")) {
      setIslink(false);
    }
    if (!smsText.includes("#FirstName")) {
      setIsname(false);
    }
  }, [smsText]);

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
      setIslink(true);
    } else {
      // Handle the case where smsText is not a string (e.g., null, undefined)
      setSmsText(linkEmbed);
      setIslink(false);
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
      setIsname(true);
    } else {
      // Handle the case where smsText is not a string (e.g., null, undefined)
      setSmsText(linkEmbed);
    }
  };

  const handleSms = (e) => {
    setSmsText(e.target.value);
    if (smsText.length > 10) {
      setIsText(true);
    } else {
      setIsText(false);
    }
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
        dispatch(setOperation(true));
        navigate(`/home`);
      } else {
        setErrorMessage("Error sending SMS");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error sending SMS");
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
        dispatch(setOperation(true));
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
        setContactList(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (e) => {
    if (e.target.value !== "Choose") {
      const recipientData = JSON.parse(e.target.value);
      setRecipients(recipientData);
      console.log(recipientData.contact_lenght);
      if (recipientData.contact_lenght > 0) {
        setIslist(true);
      } else if (recipientData.contact_lenght === 0) {
        setIslist(false);
      }
    } else {
      setIslist(false);
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
  console.log(recipients.contact_length);
  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <h3 class="xl:text-3xl lg:text-2xl text-xl text-left font-semibold text-white mx-20">
              Sms sending flow
            </h3>
            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-md mx-20">
            <div className="grid gap-2 bg-mainBlue border-gray-800 border-2 rounded-2xl">
              <div class="rounded p-10">
                <h3 class="text-2xl text-left font-extralight text-white mb-4">
                  Sms send
                </h3>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm text-left font-light text-gray-300 dark:text-white"
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
                  <label className="block mb-2 mt-4 text-sm text-left font-light text-gray-300 dark:text-white">
                    Select contact list:
                  </label>

                  <select
                    className="block bg-gray-300 w-50 text-gray-700 divide-y p-2 divide-gray-100 rounded-lg"
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
                  <label className="block mb-2 text-sm text-left font-light text-gray-300 dark:text-white">
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
                          className="bg-blue-700 hover:bg-blue-400 text-white font-normal py-2 px-3 rounded text-sm xl:text-base mt-4 ml-3"
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
              <p className="text-3xl font-extralight text-white text-justify">
                Sms Checklist
              </p>
              {/* <div className="font-extralight text-white p-5">
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
                {recipients?.contact_lenght > user?.sms_count && (
                  <p className="text-red-500 mt-3">
                    Warning: The selected list has more recipients than your
                    available credits.
                  </p>
                )}
              </div> */}
              <Checklist
                isListSelected={islist}
                isTextWritten={istext}
                isLinked={isLink}
                isPersonalized={isName}
              />
              <div className="flex flex-col mt-5 p-2">
                <div className="h-10">
                  {recipients.contact_lenght === 0 ? (
                    <p className="font-semibold text-sm text-red-500 text-justify">
                      Make sure to select contact list with recipients!
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex flex-row p-2">
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
                      #Link
                    </button>
                  </div>
                  <div className="flex flex-row p-2">
                    <button
                      onClick={handleNameLink}
                      disabled={smsText.length === 0 || !recipients}
                      className={`${
                        smsText.length === 0 || !recipients
                          ? "bg-gray-500"
                          : "bg-blue-800 cursor-pointer"
                      } hover:bg-blue-400 text-white font-bold py-2 px-3 rounded text-sm xl:text-base ml-2`}
                    >
                      #FirstName
                    </button>
                  </div>
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
