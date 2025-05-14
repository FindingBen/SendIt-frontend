import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import Checklist from "../Checklist/Checklist";
import useAxiosInstance from "../../utils/axiosInstance";
const RecipientsStep = ({ prevStep, updateFormData, nextStep }) => {
  const { currentUser, currentPackageState, dispatch } = useRedux();
  const axiosInstance = useAxiosInstance();
  const [sendingOptions, setSendingOptions] = useState({
    type: "",
    recipients: "",
    smsText: "",
  });
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [sendType, setSendType] = useState("");
  const [listId, setListId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const [islist, setIslist] = useState(false);
  const [istext, setIsText] = useState(false);
  const [isName, setIsname] = useState(false);
  const [isLink, setIslink] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const BASE = "https://spp.up.railway.app";
  const BASE_URL = "https://spplane.app";
  const linkURLBase = `${BASE_URL}/view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/newsletter/${params.id}`;
  const maxCharacters = 100;
  const gold_package = process.env.GOLD_PLAN;
  useEffect(() => {
    getContactLists();
  }, []);

  useEffect(() => {
    if (!smsText.includes("#Link")) {
      setIslink(false);
    }
    if (!smsText.includes("#FirstName")) {
      setIsname(false);
    }
  }, [smsText]);

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
  console.log(sendingOptions);
  const handleNext = () => {
    // Example: Pass the data you want to persist
    updateFormData({
      sendingOptions: {
        type: sendingOptions.type,
        recipients: listId,
        smsText: smsText,
      },
    });

    nextStep();
  };
  const handleChoice = (e) => {
    if (e.target.value !== "Choose") {
      const recipientData = JSON.parse(e.target.value);
      setRecipients(recipientData);
      setListId(recipientData.id);
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

  const handleTypeSelect = (type) => {
    setSendingOptions((prev) => ({
      ...prev,
      type: prev.type === type ? "" : type, // Toggle the type
    }));
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2 bg-mainBlue border-gray-800 border-r-2 relative h-screen">
          <div class="rounded p-10">
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
            <div>
              <label className="block mb-2 mt-4 text-sm text-left font-semibold text-gray-300 dark:text-white">
                Select send option:
              </label>
              <ul class="items-center w-[50%] text-sm font-medium bg-mainBlue border border-gray-200 rounded-lg sm:flex dark:text-white">
                <li
                  className={`border-b w-[50%] transition delay-75 sm:border-b-0 border-r  ${
                    sendingOptions.type === "Send"
                      ? "bg-cyan-600 border-l rounded-md"
                      : " text-white border-r rounded-md"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-license"
                      type="radio"
                      value="Email"
                      name="list-radio"
                      checked={sendingOptions.type === "Send"}
                      onChange={() => handleTypeSelect("Send")}
                      className="hidden"
                    />
                    <label
                      htmlFor="horizontal-list-radio-license"
                      className="w-full py-2 ms-2 text-sm font-medium cursor-pointer"
                    >
                      Send
                    </label>
                  </div>
                </li>
                <li
                  className={`border-b border-gray-200 w-[50%] border-r rounded-md sm:border-b-0 transition delay-75 sm:border-r ${
                    sendingOptions.type === "Schedule"
                      ? "bg-cyan-600 text-white"
                      : "text-white"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id="horizontal-list-radio-id"
                      type="radio"
                      value="Schedule"
                      name="list-radio"
                      checked={sendingOptions.type === "Schedule"}
                      onChange={() => handleTypeSelect("Schedule")}
                      className="hidden"
                    />
                    <label
                      htmlFor="horizontal-list-radio-id"
                      className="w-full py-2 ms-2 text-sm font-medium cursor-pointer"
                    >
                      Schedule
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <br></br>
            <div className=" gap-2">
              <label className="block text-normal text-left font-semibold text-gray-300 dark:text-white">
                Link and personalize:
              </label>
              <div className="flex flex-row">
                <button
                  onClick={handleAddLink}
                  value={linkURLBase}
                  disabled={smsText.length === 0 || recipients.length === 0}
                  className={`${
                    smsText.length === 0 || recipients.length === 0
                      ? "bg-gray-500"
                      : "bg-cyan-600"
                  } hover:bg-cyan-700 cursor-pointer text-white font-semibold py-1 px-1 border-gray-500 rounded text-sm xl:text-normal mt-1`}
                >
                  #Link
                </button>
                <button
                  onClick={handleNameLink}
                  disabled={smsText.length === 0 || !recipients}
                  className={`${
                    smsText.length === 0 || !recipients
                      ? "bg-gray-500"
                      : "bg-cyan-600"
                  } hover:bg-cyan-700 cursor-pointer text-white font-semibold py-1 px-1 border-gray-500 rounded text-sm xl:text-normal mt-1 ml-2`}
                >
                  #FirstName
                </button>
              </div>
            </div>
            <div className="form-group mt-3 purple-border text-gray-100 rounded-lg">
              <label className="block mb-2 text-sm text-left font-semibold dtext-white">
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
              <div className="grid grid-cols-3"></div>
            </div>
          </div>

          {errorMessage && (
            <div
              class="mx-5 p-4 mb-4 h-20 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-2"
              role="alert"
            >
              <span class="font-medium">Sms send error!</span> {errorMessage}
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
          <div className="flex flex-row gap-2 absolute bottom-10">
            <button
              type="submit"
              onClick={prevStep}
              // disabled={elementContextList.length === 0} // Disable if name or type is empty
              className={`text-white mx-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
             
                bg-cyan-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
            `}
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleNext}
              // disabled={elementContextList.length === 0} // Disable if name or type is empty
              className={`text-white mx-auto font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
             
                bg-cyan-700 hover:bg-cyan-400 focus:ring-4 focus:outline-none focus:ring-blue-300"
            `}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipientsStep;
