import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../../utils/axiosInstance";
import { config } from "../../constants/Constants";
import LoaderComponent from "../../components/LoaderComponent";

const ShowQrModal = ({ showModalQr, onClose }) => {
  const axiosInstance = useAxiosInstance();
  const [loading, setloading] = useState(true);
  const params = useParams();
  const [qrImg, setQrImage] = useState();
  const [show, setShowModal] = useState(showModalQr);
  const baseURL = config.url.BASE_URL;
  const env = process.env.REACT_APP_ENV;
  const imgSrc =
    env === "development"
      ? `${baseURL}${qrImg?.qr_image}`
      : `${qrImg?.qr_image}`;
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
        setloading(false);
        console.log(response);
        setQrImage(response?.data);
      }
    } catch (error) {
      setloading(false);
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
            <div className="relative w-auto max-w-3xl rounded-2xl">
              {/*content*/}
              <div className="relative flex flex-col w-full bg-ngrokGray">
                {/*header*/}

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {!loading ? (
                    <img
                      src={imgSrc}
                      alt="QR Code"
                      width={150}
                      className="block mx-auto mb-4"
                    />
                  ) : (
                    <div className="block mx-auto mb-2">
                      <LoaderComponent />
                    </div>
                  )}
                  <p className="my-4 text-slate-500 text-normal leading-relaxed">
                    Simply copy the QR code and share this with people, print it
                    out on your guest cards or put it in your shop or place of
                    business where people can see it. They will use their phones
                    to scan it which will lead them to this list to sign up.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
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
