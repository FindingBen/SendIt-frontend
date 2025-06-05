import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import SmsConfirmModal from "../features/modal/SmsConfirmModal";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
import { useRedux } from "../constants/reduxImports";
import { setOperation } from "../redux/reducers/messageReducer";
import SmsPill from "../components/SmsPill/SmsPill";
import CreditComponent from "../components/CreditStatus/CreditComponent";
import Checklist from "../components/Checklist/Checklist";
import { Tooltip } from "react-tooltip";

const SmsSendingPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentPackageState, currentSmsPackCount, dispatch } =
    useRedux();
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
  }, []);
  console.log(recipients);
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
    if (smsText.length > 5) {
      setIsText(true);
    } else {
      setIsText(false);
    }
  };

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        console.log(response.data);
        setContactList(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDate = (date) => {
    setDateSchedule(date);
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

  const TooltipContent = () => (
    <div>
      <p>
        On your right side you have two buttons. <br></br>, the second one is
        for linking the content page you want to showcase
      </p>
    </div>
  );

  return (
    <section className="h-screen overflow-hidden w-100 items-center justify-center">
      <div className="flex flex-col space-y-5 lg:space-y-0">
        <div className="flex justify-between border-b-2 border-gray-800 items-center h-20 bg-navBlue w-full">
          <h3 class="xl:text-2xl lg:text-xl text-xl text-left font-semibold text-white mx-20">
            Send sms
          </h3>
          <div class="flex flex-row items-center mx-20">
            <SmsPill />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="gap-2 bg-mainBlue border-gray-800 border-r-2 relative w-full h-screen">
            <div class="rounded p-10 h-[20%]">
              {/* <div>
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
            </div> */}

              <label className="block mb-2 mt-4 text-normal text-left font-semibold text-white ">
                Select contact list:
              </label>

              <select
                className="block bg-mainBlue text-white border-2 border-gray-600 w-50 divide-y p-2 divide-gray-100 rounded-lg"
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

              <br></br>
            </div>
            <div className="flex flex-col gap-3 p-10">
              <div className="flex flex-row gap-3 relative w-[65%] mb-3">
                <label className="text-lg absolute left-0 font-semibold text-left text-white">
                  Sms text
                </label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  data-tooltip-id="my-tooltip"
                  stroke="currentColor"
                  class="size-5 hover:cursor-pointer absolute left-20 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                <Tooltip id="my-tooltip">
                  <TooltipContent />
                </Tooltip>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={handleAddLink}
                  value={linkURLBase}
                  disabled={smsText.length === 0 || recipients.length === 0}
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-5 text-white hover:transition ease-in-out delay-90 rounded-md cursor-pointer duration-75 hover:-translate-y-1 hover:scale-105 absolute right-0"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  onClick={handleNameLink}
                  disabled={smsText.length === 0 || !recipients}
                  stroke="currentColor"
                  class="size-5 text-white hover:transition ease-in-out delay-90 rounded-md cursor-pointer duration-75 hover:-translate-y-1 hover:scale-105 absolute right-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
              </div>

              <textarea
                id="smsTextArea"
                maxLength={maxCharacters}
                className="block p-2.5 h-[100px] w-[65%] text-sm text-gray-800 font-semibold bg-gray-200 rounded-lg border border-gray-300"
                placeholder="Write your sms here..."
                onChange={handleSms}
                value={smsText}
              ></textarea>
            </div>
            <div className="p-10">
              <Checklist
                isListSelected={islist}
                isTextWritten={istext}
                isLinked={isLink}
                isPersonalized={isName}
              />
            </div>

            {/* {errorMessage && (
            <div
              class="mx-5 p-4 mb-4 h-20 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-2"
              role="alert"
            >
              <span class="font-medium">Sms send error!</span> {errorMessage}
            </div>
          )} */}
          </div>
          <div className="flex-1 p-10">
            <CreditComponent
              recipientList={recipients}
              currentCredits={currentSmsPackCount.sms_count}
              smsText={smsText}
            />

            <div className="flex-1 mt-5">
              <p className="text-3xl font-normal text-white text-justify">
                Send or Schedule
              </p>
              <div className="flex flex-row gap-3 items-center mt-3">
                <button
                  onClick={() => {
                    setShow(true);
                  }}
                  disabled={smsText.length === 0 || !recipients}
                  className={`sms-button-style ${
                    smsText.length === 0 || !recipients
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-400/40"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-10 text-cyan-700 mx-auto"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                  <label className="text-gray-200 font-semibold ">Send</label>
                </button>
                <button
                  onClick={() => setShowSchedule(true)}
                  disabled={smsText.length === 0 || recipients.length === 0}
                  className={`sms-button-style ${
                    smsText.length === 0 || !recipients
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-400/40"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-10 text-cyan-700 mx-auto"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  <label className="text-gray-200 font-semibold ">
                    Schedule
                  </label>
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
          errorMsg={errorMessage}
          sendConfirm={scheduleSms}
          showModal={showSchedule}
          dateSchedule={handleDate}
          onClose={() => setShowSchedule(false)}
        ></ScheduleSmsModal>
      </div>
    </section>
  );
};

export default SmsSendingPage;
