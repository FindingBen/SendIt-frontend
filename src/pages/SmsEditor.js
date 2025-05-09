import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
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
  const [loading, setLoading] = useState(false);
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const [islist, setIslist] = useState(false);
  const [istext, setIsText] = useState(false);
  const [isName, setIsname] = useState(false);
  const [isLink, setIslink] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const gold_package = process.env.GOLD_PLAN;
  const trial_plan = process.env.TRIAL_PLAN;
  const BASE = "https://spp.up.railway.app";
  const BASE_URL = "https://spplane.app";
  const linkURLBase = `${BASE_URL}/view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/newsletter/${params.id}`;
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

  useEffect(() => {
    if (errorMessage) {
      // Only run the timer if there's an error message
      const timer = setTimeout(() => setErrorMessage(""), 3000);

      return () => clearTimeout(timer); // Clear the timer when the component unmounts or `errorMsg` changes
    }
  }, [errorMessage]);

  const handleSms = (e) => {
    setSmsText(e.target.value);
    if (smsText.length > 5) {
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
        content_link: uniqueLink,
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
      setErrorMessage(e.response.data.error);
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

      if (recipientData.contact_lenght > 0) {
        setIslist(true);
      } else if (recipientData.contact_lenght === 0) {
        setIslist(false);
        setRecipients(recipientData);
      }
    } else {
      setIslist(false);
    }
  };

  const canScheduleSms = () => {
    if (currentPackageState === gold_package) {
      return false;
    }
    return true;
  };

  const handleDate = (date) => {
    setDateSchedule(date);
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
            <h3 class="xl:text-2xl lg:text-xl text-xl text-left font-semibold text-white mx-20">
              Sms sending flow
            </h3>
            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-md mx-20">
            <div className="grid gap-2 bg-mainBlue border-gray-800 border-2 rounded-2xl relative">
              <div class="rounded p-10">
                <h3 class="text-2xl text-left font-semibold text-white mb-4">
                  Sms send
                </h3>
                <div>
                  <label
                    for="first_name"
                    className="block mb-2 text-sm text-left font-semibold text-gray-300 dark:text-white"
                  >
                    From:
                  </label>

                  <input
                    type="text"
                    name="from"
                    disabled
                    value={"(+1) 2012550867"}
                    className="block bg-mainBlue text-white border-2 border-gray-800 mt-1 text-semibold font-light py-2 px-4 rounded w-50"
                  />
                </div>

                <div>
                  <label className="block mb-2 mt-4 text-sm text-left font-semibold text-gray-300 dark:text-white">
                    Select contact list:
                  </label>

                  <select
                    className="block bg-mainBlue text-white border-2 border-gray-800 w-50 divide-y p-2 divide-gray-100 rounded-lg"
                    onChange={handleChoice}
                  >
                    <option value={"Choose"}>Choose your list</option>
                    {contactLists?.map((item) => (
                      <option
                        key={item.id}
                        value={JSON.stringify(item)}
                        className="text-white font-semibold"
                      >
                        {item.list_name}
                      </option>
                    ))}
                  </select>
                </div>
                <br></br>
                <div className="form-group purple-border text-gray-100 rounded-lg">
                  <label className="block mb-2 text-sm text-left font-semibol dtext-white">
                    Sms text:
                  </label>

                  <div className="relative">
                    <textarea
                      id="smsTextArea"
                      maxLength={maxCharacters}
                      className="block p-2.5 h-2/4 w-[65%] text-sm text-gray-800 font-semibold bg-gray-400 rounded-lg border border-gray-300"
                      placeholder="Write your sms here..."
                      onChange={handleSms}
                      value={smsText}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="flex flex-row">
                      <button
                        onClick={() => {
                          setShow(true);
                        }}
                        type="submit"
                        color="dark"
                        className={`text-white font-normal py-2 px-3 rounded text-sm xl:text-base mt-4 ${
                          recipients.contact_lenght === 0 ||
                          !recipients ||
                          smsText.length === 0
                            ? "bg-gray-600 cursor-not-allowed" // Disabled state styling
                            : "bg-cyan-600 hover:bg-cyan-400 cursor-pointer" // Default state styling
                        }`}
                        disabled={
                          recipients.contact_lenght === 0 ||
                          !recipients ||
                          smsText.length === 0
                        }
                      >
                        Send
                      </button>

                      {/* {canScheduleSms() ? (
                        <button
                          onClick={() => setShowSchedule(true)}
                          type="submit"
                          disabled={
                            recipients.contact_lenght === 0 ||
                            !recipients ||
                            smsText.length === 0
                          }
                          color="dark"
                          className={` text-white font-normal py-2 ${
                            recipients.contact_lenght === 0 ||
                            !recipients ||
                            smsText.length === 0
                              ? "bg-gray-600 cursor-not-allowed" // Disabled state styling
                              : "bg-cyan-600 hover:bg-cyan-400 cursor-pointer" // Default state styling
                          } px-3 rounded text-sm xl:text-base mt-4 ml-3`}
                        >
                          Schedule
                        </button>
                      ) : (
                        <></>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 absolute right-2 bottom-2">
                <div className="flex flex-row">
                  <button
                    onClick={handleAddLink}
                    value={linkURLBase}
                    disabled={smsText.length === 0 || recipients.length === 0}
                    className={`${
                      smsText.length === 0 || recipients.length === 0
                        ? "bg-gray-500"
                        : "bg-blue-950 cursor-pointer"
                    } hover:bg-blue-800 text-white font-semibold py-2 px-3 border-gray-500 rounded text-sm xl:text-base ml-2 mt-4`}
                  >
                    #Link
                  </button>
                </div>
                <div className="flex flex-row">
                  <button
                    onClick={handleNameLink}
                    disabled={smsText.length === 0 || !recipients}
                    className={`${
                      smsText.length === 0 || !recipients
                        ? "bg-gray-500"
                        : "bg-blue-950 cursor-pointer"
                    } hover:bg-blue-800 text-white font-semibold py-2 px-3 border-gray-500 rounded text-sm xl:text-base ml-2 mt-4`}
                  >
                    #FirstName
                  </button>
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
                  {recipients?.contact_lenght === 0 ? (
                    <p className="font-semibold text-sm text-red-500 text-justify">
                      Make sure to select contact list with recipients!
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
                {islist && isLink && isName && istext && (
                  <div className="flex flex-row gap-2">
                    <p className="text-green-600 text-normal text-justify">
                      Yout text is ready for sending!
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6 text-green-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <SmsConfirmModal
              // recipientNumber={}
              sendConfirm={sendSms}
              showModal={show}
              onClose={() => setShow(false)}
            ></SmsConfirmModal>
            {/* <ScheduleSmsModal
              errorMsg={errorMessage}
              sendConfirm={scheduleSms}
              showModal={showSchedule}
              dateSchedule={handleDate}
              onClose={() => setShowSchedule(false)}
            ></ScheduleSmsModal> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmsEditor;
