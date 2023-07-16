import React, { useState, useEffect } from "react";
import { selectCurrentToken } from "../../features/auth/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import Papa from "papaparse";
import { useNavigate, useParams } from "react-router-dom";

const CsvModal = ({ showModal, onClose }) => {
  const [show, setShowModal] = useState(showModal);
  const allowedExtensions = ["csv"];
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const params = useParams();
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    setShowModal(showModal);
  }, [showModal]);

  const handleCsvFile = async (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };

  const handleParse = async () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
      });
      const parsedData = csv?.data;

      await createContact(parsedData);
    };
    reader.readAsText(file);
    closeModal();
  };

  const createContact = async (parsedData) => {
    for (const contact of parsedData) {
      try {
        let response = await axiosInstance.post(
          `http://127.0.0.1:8000/api/create_contact/${params.id}/`,
          {
            first_name: contact.first_name,
            last_name: contact.last_name,
            phone_number: contact.phone_number,
            email: contact.email,
            contact_list: params.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(token),
            },
          }
        );
        console.log("Response:", response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeModal = () => {
    onClose();
  };

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
                  <h3 className="text-3xl font-semibold">Upload a csv file</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Keep in mind that file needs to be in .csv format, otherwise
                    it wont work!
                  </p>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    onChange={handleCsvFile}
                  ></input>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleParse}
                  >
                    Save Changes
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

export default CsvModal;
