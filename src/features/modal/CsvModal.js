import React, { useState, useEffect } from "react";
import { selectCurrentToken } from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { useRedux } from "../../constants/reduxImports";
import Papa from "papaparse";
import { useNavigate, useParams } from "react-router-dom";

const CsvModal = ({ showModalCsv, onClose, newContacts }) => {
  const [show, setShowModal] = useState(showModalCsv);
  const { currentPackageState } = useRedux();
  const allowedExtensions = ["csv", "xlsx"];
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);
  const params = useParams();
  const axiosInstance = useAxiosInstance();
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    setShowModal(showModalCsv);
  }, [showModalCsv, contacts]);

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

      let response = await axiosInstance.get(`/api/contact_list/${params.id}`);
      if (response.status === 200) {
        const totalContacts = response.data.contact_list_recipients_nr;
        //console.log(response.data);
        console.log(totalContacts);
        if (
          parsedData.length + totalContacts >
          currentPackageState.recipients_limit
        ) {
          console.log("SS");
          setError(
            "You cannot upload more contacts than your recipient limit."
          );
          return;
        } else {
          await createContact(parsedData);
        }

        closeModal();
      }

      closeModal();
    };
    reader.readAsText(file);
  };

  const createContact = async (parsedData) => {
    console.log("pass");
    for (const contact of parsedData) {
      try {
        let response = await axiosInstance.post(
          `/api/create_contact/${params.id}/`,
          {
            firstName: contact.first_name,
            lastName: contact.last_name,
            phone: contact.phone,
            email: contact.email,
            contact_list: params.id,
          }
        );

        if (response.status === 200 || 201) {
          newContacts((prevContacts) => [...prevContacts, response.data]);
        }
      } catch (error) {
        setError(error.response.data.detail);
      }
    }
  };

  const closeModal = () => {
    onClose();
    setError("");
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
              <div className="border-0 rounded-xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <Modal.Header closeButton>
                  <Modal.Title>Upload a csv file</Modal.Title>
                </Modal.Header>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Keep in mind that file needs to be in .csv format and
                    columns need to match these names: <b>first_name</b>,{" "}
                    <b>last_name</b>, <b>phone_number</b> and <b>email</b>,
                    otherwise it wont work!
                  </p>
                  <input
                    className="block w-full text-sm p-1 text-gray-900 border border-gray-300 rounded-xl cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    onChange={handleCsvFile}
                  ></input>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  {error && (
                    <p className="text-red-700 text-normal font-semibold">
                      {error}
                    </p>
                  )}
                  <button
                    className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={handleParse}
                  >
                    Upload
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

export default CsvModal;
