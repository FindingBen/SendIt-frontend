import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import useAxiosInstance from "../../utils/axiosInstance";
import { config } from "../../constants/Constants";

const ShowQrModal = ({ showModalQr, onClose }) => {
  const axiosInstance = useAxiosInstance();
  const { currentUser } = useRedux();
  const params = useParams();
  const [qrImg, setQrImage] = useState();
  const [show, setShowModal] = useState(showModalQr);
  const baseURL = config.url.BASE_URL;

  useEffect(() => {
    setShowModal(showModalQr);
    getQRcode();
  }, [showModalQr]);

  const closeModal = () => {
    onClose();
  };

  const getQRcode = async () => {
    try {
      let response = await axiosInstance.get(`/api/qr_code/${params.id}`);
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        setQrImage(response.data);
      }
    } catch (error) {}
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
            <div className="relative w-auto max-w-3xl rounded-2xl">
              {/*content*/}
              <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>Your QR code for this contact list</Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <img
                    src={`${baseURL}${qrImg?.qr_image}`}
                    alt="QR Code"
                    width={150}
                    className="block mx-auto mb-4"
                  />
                  <p className="my-4 text-slate-500 text-normal leading-relaxed">
                    Simply copy the QR code and share this with people, print it
                    out on your guest cards or put it in your shop or place of
                    business where people can see it. They will use their phones
                    to scan it which will lead them to this list to sign up. And
                    you will have their information for promotional offers etc..
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default ShowQrModal;
