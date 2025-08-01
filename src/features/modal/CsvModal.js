import React, { useState, useEffect } from "react";
import { selectCurrentToken } from "../../redux/reducers/authSlice";
import useAxiosInstance from "../../utils/axiosInstance";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { useRedux } from "../../constants/reduxImports";
import Papa from "papaparse";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/LoaderSkeleton/Loader";

const CsvModal = ({ showModalCsv, onClose, newContacts }) => {
  const [show, setShowModal] = useState(showModalCsv);
  const { currentPackageState } = useRedux();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
        setLoading(false);
        const totalContacts = response.data.contact_list_recipients_nr;
        //console.log(response.data);
        console.log(totalContacts);
        if (
          parsedData.length + totalContacts >
          currentPackageState.recipients_limit
        ) {
          setError(
            "You cannot upload more contacts than your recipient limit."
          );
          return;
        } else {
          setLoading(false);
          await createContact(parsedData);
        }

        closeModal();
      }

      closeModal();
    };
    reader.readAsText(file);
  };

  const createContact = async (parsedData) => {
    const data = { bulk_data: parsedData, list_id: params.id };

    try {
      let response = await axiosInstance.post(`/api/upload_bulk_contacts/`, {
        data,
      });

      if (response.status === 200 || 201) {
        console.log("AAA", response.data);
        setTimeout(() => setLoading(false), 5000);
        newContacts((prevContacts) => [...prevContacts, ...response.data.data]);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.data.detail);
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
              <div className="relative flex flex-col w-full bg-ngrokGray outline-none focus:outline-none">
                {/*header*/}
                <span className="text-2xl font-euclid p-6 text-slate-400">
                  Upload contacts
                </span>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg font-euclid leading-relaxed">
                    Keep in mind that file needs to be in .csv format and
                    columns need to match these names: <b>firstName</b>,{" "}
                    <b>lastName</b>, <b>phone</b> and <b>email</b>, otherwise it
                    wont work!
                  </p>
                  <p className="text-slate-500 font-euclid mb-2">
                    If you do have different format and a lot of contacts,
                    please feel free to write us on support and we will
                    accomodate you.
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
                  {loading ? (
                    <Loader color={true} loading_name={"Loading..."} />
                  ) : (
                    <div className="flex flex-row gap-2">
                      <button
                        className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                        type="button"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button
                        className="bg-ngrokBlue hover:bg-blue-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                        type="button"
                        onClick={handleParse}
                      >
                        Upload
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

export default CsvModal;
