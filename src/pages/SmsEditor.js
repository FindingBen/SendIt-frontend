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

const SmsEditor = () => {
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [smsText, setSmsText] = useState();

  useEffect(() => {
    getMessage();
  }, []);

  const handleSms = (e) => {
    setSmsText(e.target.value);
    console.log(e.target.value);
  };

  const getMessage = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:8000/sms/sms-editor/${params.id}`
      );
      console.log(response);
      if (response.status === 200) {
        setMessage(response.data);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut(user, token));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendSms = async (e) => {
    e.preventDefault();
    let response = await axiosInstance.post(
      "http://localhost:8000/sms/sms-send/",
      {
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
    console.log(response);
    if (response.status === 200 || 201) {
      navigate(`/home`);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <h1 className="text-3xl font-bold mb-4">Sms editor</h1>
            <div class="md-form">
              <label for="form1">From</label>
              <input type="text" name="from" class="form-control" />
            </div>

            <div class="md-form">
              <label for="form1">Contact list</label>
              <input type="text" name="contactList" class="form-control" />
            </div>
            <br></br>
            <div class="form-group purple-border">
              <label for="exampleFormControlTextarea4">Text message</label>
              <textarea
                onChange={handleSms}
                class="form-control"
                id="exampleFormControlTextarea4"
                rows="3"
                name="text_message"
              ></textarea>
              <br></br>
              <button
                onClick={sendSms}
                type="submit"
                color="dark"
                className="btn btn-dark"
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
