import React, { useEffect, useState } from "react";
import useAxiosInstance from "../../utils/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import moment from "moment/moment";

const ScheduleSmsModal = ({
  showModal,
  onClose,
  sendConfirm,
  dateSchedule,
}) => {
  const today = new Date();
  const [show, setShowModal] = useState(showModal);
  const axiosInstance = useAxiosInstance();
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
  };
  console.log(dateValue?.toISOString());
  return (
    <>
      {show ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Scheduling SMS confirmation!
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    You are about to schedule the sms message to multiple phone
                    devices, choose date and time then press Send.
                  </p>
                  <DatePicker
                    useWeekdaysShort={true}
                    selected={dateValue}
                    onChange={handleDate}
                    dateFormat="yyyy-MM-dd"
                    showTimeSelect
                    placeholderText="Start date"
                    className="bg-grayWhite h-10 w-32 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                  ></DatePicker>
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    It will be scheduled for{" "}
                    <p className="font-bold">{dateValue?.toLocaleString()}</p>
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Terminate
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => sendConfirm()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ScheduleSmsModal;
