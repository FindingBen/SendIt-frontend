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
const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [linkURL, setLinkURL] = useState("");
  const [message, setMessage] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [smsText, setSmsText] = useState([]);
  const [user, setUser] = useState();
  const textComponentRef = useRef(null);
  //const BASE_URL = "http://localhost:8000/";
  const BASE_URL = "https://sendit-frontend-production.up.railway.app";
  const linkURLBase = `${BASE_URL}/message_view/${params.id}`;

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
  }, [smsText, textComponentRef]);

  const handleAddLink = (e) => {
    const linkEmbed = `#Link`;
    const textarea = document.getElementById("smsTextArea");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    setLinkURL(linkURLBase);
    // Insert the link at the specified index
    setSmsText(
      smsText.substring(0, startPos) + linkEmbed + smsText.substring(endPos)
    );
  };

  const handleSms = (e) => {
    setSmsText(e.target.value);
  };

  // let getUser = async () => {
  //   try {
  //     let response = await axiosInstance.get(`/api/user_account/${userId}/`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + String(token),
  //       },
  //     });

  //     if (response.status === 200) {
  //       setUser(response.data);
  //     } else {
  //       localStorage.removeItem("tokens");
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const getMessage = async () => {
  //   try {
  //     const response = await axiosInstance.get(`/sms/sms-editor/${params.id}`);

  //     if (response.status === 200) {
  //       setMessage(response.data);
  //     } else if (response.statusText === "Unauthorized") {
  //       dispatch(logOut());
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const sendSms = async (e) => {
    e.preventDefault();
    try {
      let response = await axiosInstance.post(
        "/sms/sms-send/",
        {
          user: userId,
          sender: "ME",
          sms_text: smsText,
          content_link: linkURL,
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
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.log(error);
    }
  };
  console.log(smsText);
  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Sms configuration
              </h1>
              <hr></hr>
            </div>
            <div className="col">
              <div className="md-form mt-2">
                <label for="form1">From</label>
                <input type="text" name="from" className="form-control" />
              </div>

              <div className="md-form">
                <label for="form1">Contact list</label>
                <input
                  type="text"
                  name="contactList"
                  className="form-control"
                />
              </div>
              <br></br>
              <div className="form-group purple-border">
                <label for="exampleFormControlTextarea4">Text message</label>

                <textarea
                  id="smsTextArea"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  onChange={handleSms}
                  value={smsText}
                ></textarea>
                <button
                  onClick={handleAddLink}
                  value={linkURLBase}
                  className="bg-blue-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded mb-5"
                >
                  Add link
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
            <div className="col">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl ">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

                <div
                  className="rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-gray-950 dark:bg-gray-800"
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
