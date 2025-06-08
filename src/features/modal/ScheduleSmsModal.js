import React, { useEffect, useState } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import Loader from "../../components/LoaderSkeleton/Loader";

const ScheduleSmsModal = ({
  showModal,
  onClose,
  sendConfirm,
  dateSchedule,
  errorMsg,
}) => {
  const today = new Date();
  const [show, setShowModal] = useState(showModal);
  const axiosInstance = useAxiosInstance();
  const [error, setError] = useState(errorMsg);
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState();

  useEffect(() => {
    setShowModal(showModal);
  }, [showModal, dateValue]);

  const handleDate = (date) => {
    const newDate = new Date(date);
    const formated = moment(newDate).format("YYYY-MM-DD HH:mm");
    dateSchedule(formated);
    setDateValue(newDate);
  };

  const closeModal = () => {
    onClose();
    setError("");
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      await sendConfirm(); // Make sure sendConfirm returns a Promise!
      setLoading(false);
      closeModal();
    } catch (err) {
      setLoading(false);
      setError("Failed to schedule message.");
    }
  };

  return (
    <>
      {show ? (
        <>
          <Modal
            show={show}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            <div className="relative w-auto mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>
                    <div className="flex flex-row">
                      <p>Scheduling message confirmation!</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 ml-2 mt-2"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to schedule the sms message to multiple phone
                    devices, choose date and time then press Send.
                  </p>
                  <div className="flex flex-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-7 h-7 mt-1.5 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>

                    <DatePicker
                      useWeekdaysShort={true}
                      selected={dateValue}
                      onChange={handleDate}
                      dateFormat="yyyy-MM-dd"
                      showTimeSelect
                      timeIntervals={5}
                      placeholderText="Select date"
                      className="bg-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400 duration-200"
                    ></DatePicker>
                  </div>
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    It will be scheduled for{" "}
                    <p className="font-bold">{dateValue?.toLocaleString()}</p>
                  </p>
                  {errorMsg ? (
                    <p className="text-red-700 font-semibold">{error}</p>
                  ) : (
                    <></>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  {loading ? (
                    <Loader color={true} loading_name="Scheduling..." />
                  ) : (
                    <div>
                      <button
                        className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                        type="button"
                        onClick={closeModal}
                      >
                        Terminate
                      </button>
                      <button
                        className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                        type="button"
                        onClick={() => sendConfirm()}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default ScheduleSmsModal;
