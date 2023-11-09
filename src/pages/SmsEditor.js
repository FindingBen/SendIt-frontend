import React, { useState, useEffect, useParam, useRef } from "react";
import { setState } from "../features/modal/formReducer";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";
import ScheduleSmsModal from "../features/modal/ScheduleSmsModal";
import "../css/Sms.css";
import TextComponent from "../components/TextComponent";
import iPhoneImage from "../../src/assets/iphone_bg.jpg";
import SmsConfirmModal from "../features/modal/SmsConfirmModal";

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [linkURL, setLinkURL] = useState("");
  const [dateSchedule, setDateSchedule] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const textComponentRef = useRef(null);
  const [recipients, setRecipients] = useState();

  const BASE = "https://sendit-backend-production.up.railway.app";
  const BASE_URL = "https://sendit-frontend-production.up.railway.app";
  const linkURLBase = `${BASE_URL}/message_view/${params.id}`;
  const uniqueLink = `${BASE}/sms/sms/tracking/`;
  useEffect(() => {
    getContactLists();
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

  const handleSms = (e) => {
    setSmsText(e.target.value);
  };

  const sendSms = async () => {
    try {
      let response = await axiosInstance.post(
        "/sms/sms-send/",
        {
          user: userId,
          sender: "ME",
          sms_text: smsText,
          content_link: uniqueLink,
          message: params.id,
          contact_list: recipients,
          scheduled: false,
          // is_sent: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      if (response.status === 200 || 201) {
        navigate(`/home`);
      }

      console.log(response);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.log(error);
    }
  };

  const scheduleSms = async () => {
    try {
      let response = await axiosInstance.post(
        "/sms/sms-send-schedule/",
        {
          user: userId,
          sender: "ME",
          sms_text: smsText,
          content_link: uniqueLink,
          message: params.id,
          contact_list: recipients,
          scheduled_time: dateSchedule,
          scheduled: true,
          is_sent: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      if (response.status === 200 || 201) {
        navigate(`/home`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      if (response.status === 200) {
        setContactList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChoice = (e) => {
    setRecipients(e.target.value);
    console.log(e?.target?.value);
  };

  const handleDate = (date) => {
    setDateSchedule(date);
  };

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="row">
            <div className="flex justify-between items-center mb-3">
              <h3 class="text-3xl text-left font-extralight text-white/50">
                Sms setttings
              </h3>
            </div>
            <div className="grid grid-cols-2 bg-darkestGray rounded-md">
              <div className="grid gap-2 border-r-2">
                <div class="rounded p-10">
                  <h3 class="text-2xl text-left font-extralight text-white/50 mb-4">
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
                      onClick={handleChoice}
                    >
                      <option value="" disabled selected>
                        Choose your list
                      </option>
                      {contactLists?.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
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

                    <textarea
                      id="smsTextArea"
                      maxLength={70}
                      className="block p-2.5 w-75 h-2/4 text-sm text-gray-50 bg-gray-400 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your sms here..."
                      onChange={handleSms}
                      value={smsText}
                    ></textarea>

                    <div className="grid grid-cols-2 gap-6 content-between">
                      <div className="flex flex-row">
                        {recipients && smsText.length > 0 ? (
                          <button
                            onClick={() => setShow(true)}
                            type="submit"
                            color="dark"
                            className="bg-green-800 hover:bg-green-400 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4"
                          >
                            Send
                          </button>
                        ) : (
                          <button
                            disabled
                            type="submit"
                            color="dark"
                            className="bg-gray-600 opacity-80 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4"
                          >
                            Send
                          </button>
                        )}
                        {recipients && smsText.length > 0 ? (
                          <button
                            onClick={() => setShowSchedule(true)}
                            type="submit"
                            color="dark"
                            className="bg-yellow-700 hover:bg-yellow-300 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4 ml-3"
                          >
                            Schedule
                          </button>
                        ) : (
                          <button
                            disabled
                            type="submit"
                            color="dark"
                            className="bg-yellow-700 opacity-80 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4 ml-3"
                          >
                            Schedule
                          </button>
                        )}
                        {recipients && smsText.length > 0 ? (
                          <button
                            onClick={handleAddLink}
                            value={linkURLBase}
                            className="bg-blue-800 hover:bg-blue-400 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4 ml-44 xl:ml-72"
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
                        ) : (
                          <button
                            onClick={handleAddLink}
                            value={linkURLBase}
                            disabled
                            className="bg-gray-500 text-white font-bold py-2 px-3 rounded text-sm w-22 h-12 xl:w-28 xl:h-14 xl:text-base mt-4 ml-44 xl:ml-72"
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
              <div className="col mt-3 p-10">
                <div class="h-[500px] w-[250px] relative mx-auto border-gray-200 dark:border-gray-800 bg-gray-200 border-[14px] rounded-[2.5rem] xl:h-[600px] xl:w-[300px] shadow-xl">
                  <div class="w-[108px] h-[10px] xl:w-[148px] xl:h-[18px] bg-gray-200 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div class="h-[46px] w-[3px] bg-gray-200 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div class="h-[46px] w-[3px] bg-gray-200 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div class="h-[64px] w-[3px] bg-gray-200 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div
                    class="w-[225px] h-[470px] rounded-[2rem] overflow-hidden xl:w-[272px] xl:h-[572px] dark:bg-gray-800"
                    style={{ backgroundImage: `url(${iPhoneImage})` }}
                  >
                    <div class="mr-5 mt-2 flex justify-end space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-200"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>{" "}
                    <div className="relative border-solid 1px h-20 my-48 mx-3 rounded-lg">
                      <div
                        className="text-6xl text-white absolute inset-x-0"
                        style={{ bottom: "232%" }}
                      >
                        9.41
                      </div>
                      <div className="bg-gray-200 flex flex-row border-none 1px h-7 rounded-t-lg">
                        <img
                          src={require("../../src/assets/message.png")}
                          height={20}
                          width={20}
                          className="mx-1 my-auto"
                        ></img>

                        <h2 className="text-1xl my-1 font-SanFrancisco text-gray-600 font-helv">
                          MESSAGES
                        </h2>
                      </div>
                      <div className="bg-gray-200 h-20 opacity-50 rounded-b-lg">
                        <TextComponent
                          className="text-gray-950"
                          ref={textComponentRef}
                          textValue={smsText}
                        />
                      </div>
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
      </div>
    </section>
  );
};

export default SmsEditor;
