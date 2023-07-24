import React, { useState, useEffect, useParam } from "react";
import { setState } from "../features/modal/formReducer";
import { useNavigate, useParams } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";
import jwtDecode from "jwt-decode";

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [smsText, setSmsText] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    getMessage();
    getUser();
  }, []);

  const handleSms = (e) => {
    setSmsText(e.target.value);
    console.log(e.target.value);
  };
  let getUser = async () => {
    try {
      let response = await axiosInstance.get(`/api/user_account/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        setUser(response.data);
      } else {
        localStorage.removeItem("tokens");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMessage = async () => {
    try {
      const response = await axiosInstance.get(`/sms/sms-editor/${params.id}`);
      console.log(response);
      if (response.status === 200) {
        setMessage(response.data);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendSms = async (e) => {
    e.preventDefault();
    try {
      if (user.sms_count > 0) {
        let response = await axiosInstance.post(
          "/sms/sms-send/",
          {
            user: userId,
            sender: "ME",
            sms_text: smsText,
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <h1 className="text-3xl font-bold mb-4">Sms editor</h1>
            <div className="md-form">
              <label for="form1">From</label>
              <input type="text" name="from" className="form-control" />
            </div>

            <div className="md-form">
              <label for="form1">Contact list</label>
              <input type="text" name="contactList" className="form-control" />
            </div>
            <br></br>
            <div className="form-group purple-border">
              <label for="exampleFormControlTextarea4">Text message</label>
              <textarea
                onChange={handleSms}
                className="form-control"
                id="exampleFormControlTextarea4"
                rows="3"
                name="text_message"
              ></textarea>
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
        </div>
      </div>
    </section>
  );
};

export default SmsEditor;
