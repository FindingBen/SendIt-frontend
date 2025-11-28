import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import SmsConfirmModal from "../features/modal/SmsConfirmModal";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
import { useRedux } from "../constants/reduxImports";
import { setOperation } from "../redux/reducers/messageReducer";
import SmsPill from "../components/SmsPill/SmsPill";
import CreditComponent from "../components/CreditStatus/CreditComponent";
import Checklist from "../components/Checklist/Checklist";
import { Tooltip } from "react-tooltip";
import Loader from "../components/LoaderSkeleton/Loader";
import Search from "../components/SearchComponent/Search";

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
  const [credit, setNewCredit] = useState();
  const [creditCost, setCreditCost] = useState();
  const [status, setStatus] = useState(true);
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

  const [finished, setFinished] = useState(false);
  const [price, setPrice] = useState({});
  const gold_package = process.env.REACT_APP_GOLD_PLAN;
  const silver_package = process.env.REACT_APP_SILVER_PLAN;
  const trial_plan = process.env.TRIAL_PLAN;
  const BASE = "https://spp.up.railway.app";
  const BASE_URL = "https://spplane.app";
  const linkURLBase = `${BASE_URL}/view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/newsletter/${params.id}`;
  const maxCharacters = 160;

  useEffect(() => {
    getContactLists();
    if (
      recipients?.contact_lenght > currentSmsPackCount.sms_count ||
      currentSmsPackCount.sms_count < 5
    ) {
      setStatus(false);
    }
  }, []);

  useEffect(() => {
    calculateCredit();
  }, [price]);

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
      setFinished(false);
    } else {
      setIsText(false);
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

  let getPricing = async () => {
    setLoading(true);
    try {
      const data = { id: recipients["id"], sms_text: smsText };
      let response = await axiosInstance.post("/sms/vonage_pricing", data);
      if (response.status === 200) {
        setLoading(false);
        setFinished(true);

        setPrice(response.data);
      }
    } catch (error) {
      setLoading(false);
      setFinished(false);
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

  const canSchedule = () => {

    if (currentPackageState?.package === gold_package) {
      return true;
    } else if (currentPackageState?.package === silver_package) {
      return true;
    } else {
      return false;
    }
  };

  const calculateCredit = () => {
    if (recipients?.contact_lenght <= 0 || !recipients) {
      setNewCredit(0);
    } else {
      const newCredit =
        currentSmsPackCount.sms_count - price?.estimated_credits;

      setNewCredit(newCredit);
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
    <section className="min-h-screen max-w-screen items-center justify-center bg-[#0A0E1A]">
  <div className="flex flex-col">
<div className="flex flex-row items-center mb-4 h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>

    {/* Main Grid */}
    <div className="grid grid-cols-12 h-full gap-6 ml-56">

      {/* Left Panel: SMS Form */}
      <div className="col-span-5 flex flex-col gap-6 bg-[#111827] border-2 border-gray-800 rounded-2xl p-6 h-full overflow-auto">
        
        {/* Contact List */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-medium">Select Contact List</label>
          <select
            className="bg-[#1F2937] text-white border-2 border-gray-600 p-2 rounded-lg w-full focus:outline-none"
            onChange={handleChoice}
          >
            <option value={"Choose"}>Choose your list</option>
            {contactLists?.map((item) => (
              <option
                key={item.id}
                value={JSON.stringify(item)}
                className="text-white font-normal"
              >
                {item.list_name}
              </option>
            ))}
          </select>
        </div>

        {/* SMS Text Area */}
        <div className={`flex flex-col gap-2 relative ${!islist ? "opacity-50" : ""}`}>
          <label className="text-white font-medium">SMS Text</label>
          <textarea
            id="smsTextArea"
            maxLength={maxCharacters}
            disabled={!islist}
            placeholder={islist ? "Write your SMS here..." : "Select a list to start typing..."}
            className={`w-full p-3 rounded-lg text-sm font-medium border ${
              islist
                ? "bg-gray-200 text-gray-800 border-gray-300"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
            onChange={handleSms}
            value={smsText}
          />

          {/* Tooltip & Action Icons */}
          {islist && (
            <div className="absolute top-2 right-2 flex gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 text-white hover:scale-110 cursor-pointer transition"
                onClick={handleAddLink}
              >
                <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5 text-white hover:scale-110 cursor-pointer transition"
                onClick={handleNameLink}
              >
                <path d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
              </svg>
            </div>
          )}

          {/* Finish Button */}
          {islist && smsText.length > 5 && (
            <div className="mt-2">
              {loading ? (
                <Loader loading_name={"Calculating..."} />
              ) : (
                !finished && (
                  <button
                    onClick={getPricing}
                    className="w-full py-2 px-4 rounded-lg bg-ngrokBlue hover:bg-cyan-600 text-white font-medium shadow"
                  >
                    Finish
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="mt-4">
          <Checklist
            isListSelected={islist}
            isTextWritten={istext}
            isLinked={isLink}
            isPersonalized={isName}
          />
        </div>
      </div>

      {/* Right Panel: Credits & Send Options */}
      <div className="col-span-7 flex flex-col gap-6">
        <CreditComponent
          status={status}
          currentCredits={currentSmsPackCount.sms_count}
          estimated={price}
          cost={credit}
        />

        <div className="bg-[#111827] border-2 border-gray-800 rounded-2xl p-6 flex flex-col gap-4 w-[90%]">
          <p className="text-white text-2xl font-normal">Send or Schedule</p>
          <div className="flex flex-row gap-4 mt-2">
            <button
              onClick={() => setShow(true)}
              disabled={smsText.length <= 5 || !recipients || !finished}
              className={`flex flex-col items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-800 transition ${
                smsText.length <= 5 || !recipients || !finished
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-ngrokBlue hover:bg-ngrokBlue/70"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-8 text-white"
              >
                <path d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <span className="text-white font-semibold">Send</span>
            </button>

            {canSchedule() && (
              <button
                onClick={() => setShowSchedule(true)}
                disabled={smsText.length <= 5 || !recipients || !finished}
                className={`flex flex-col items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-800 transition ${
                  smsText.length <= 5 || !recipients || !finished
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-ngrokBlue hover:bg-ngrokBlue/70"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-white"
                >
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-white font-semibold">Schedule</span>
              </button>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="relative mt-4 p-4 rounded-lg bg-red-50 text-red-800 flex items-start gap-2 border border-red-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-red-800 cursor-pointer hover:text-gray-400"
                onClick={() => setErrorMessage()}
              >
                <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="font-medium">SMS send error: </span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

    </div>

    {/* Modals */}
    <SmsConfirmModal
      sendConfirm={sendSms}
      showModal={show}
      onClose={() => setShow(false)}
    />
    <ScheduleSmsModal
      errorMsg={errorMessage}
      sendConfirm={scheduleSms}
      showModal={showSchedule}
      dateSchedule={handleDate}
      onClose={() => setShowSchedule(false)}
    />
  </div>
</section>

  );
};

export default SmsSendingPage;
