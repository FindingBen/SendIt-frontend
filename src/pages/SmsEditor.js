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
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/Sms.css";
import TextComponent from "../components/TextComponent";
import TrackLink from "../utils/TrackLink";
import { v4 as uuidv4 } from "uuid";

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uniqueId, setUniqueId] = useState();
  const [linkURL, setLinkURL] = useState("");
  const [message, setMessage] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [smsText, setSmsText] = useState([]);
  const [contactLists, setContactList] = useState([]);
  const textComponentRef = useRef(null);
  const [recipients, setRecipients] = useState();
  //const BASE_URL = "http://localhost:8000/";
  const BASE_URL = "https://sendit-frontend-production.up.railway.app";
  const linkURLBase = `${BASE_URL}/message_view/${params.id}`;
  const uniqueLink = `http://localhost:8000/sms/sms/tracking/`;
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

  const uniqueLinkTracker = () => {};

  const handleAddLink = () => {
    const linkEmbed = `#Link`;
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

  const sendSms = async (e) => {
    e.preventDefault();
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

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row" style={{ paddingLeft: "2.5%" }}>
            <div
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width: "95%" }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left">
                    Sms editor
                  </h1>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right">
                    Sms credit count: 0
                  </h1>
                </div>
              </div>
            </div>
            <div className="col mt-3" style={{ paddingLeft: "0%" }}>
              <div
                class="border-solid border-1 border-gray-600 rounded"
                style={{
                  backgroundColor: "#3d3e40",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingBottom: "20px",
                }}
              >
                <div className="row mt-4 text-gray-100">
                  <div className="col">
                    <label style={{ marginLeft: "0%" }} for="form1">
                      From:
                    </label>
                  </div>
                  <div className="col">
                    <input
                      style={{ marginLeft: "0%" }}
                      type="text"
                      name="from"
                      className="form-control bg-gray-300 text-gray-50 rounded-lg"
                    />
                  </div>
                </div>

                <div className="text-gray-100 mt-2">
                  <div className="row">
                    <div className="col">
                      <label for="form1">Select recipient list: </label>
                    </div>
                    <div className="col">
                      <select
                        style={{ width: "100%", marginLeft: "0%" }}
                        className="bg-gray-300 text-gray-700 divide-y divide-gray-100 rounded-lg"
                        onClick={handleChoice}
                      >
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
                  </div>
                </div>
                <br></br>
                <div className="form-group purple-border text-gray-100 rounded-lg">
                  <label for="exampleFormControlTextarea4">Text message</label>

                  <textarea
                    id="smsTextArea"
                    className="block p-2.5 w-full text-sm text-gray-50 bg-gray-500 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    onChange={handleSms}
                    value={smsText}
                  ></textarea>
                  <button
                    onClick={handleAddLink}
                    value={linkURLBase}
                    style={{ alignContent: "flex-end" }}
                    className="bg-blue-800 hover:bg-blue-400 text-white font-bold py-1 px-3 border border-gray-600 rounded mb-3 mt-2 justify-end"
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
                  <br></br>
                  <button
                    onClick={sendSms}
                    type="submit"
                    color="dark"
                    className="bg-green-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
              {errorMessage && (
                <div
                  class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-2"
                  role="alert"
                >
                  <span class="font-medium">Sms send error!</span>{" "}
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="col mt-3">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-500 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl ">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

                <div
                  className="rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-gray-500 dark:bg-gray-800"
                  id="screen"
                >
                  <div className="yours message" style={{ marginTop: "25px" }}>
                    <div className="message last">
                      <TextComponent
                        ref={textComponentRef}
                        textValue={smsText}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmsEditor;
