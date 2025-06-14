import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRedux } from "../../constants/reduxImports";
import useAxiosInstance from "../../utils/axiosInstance";
import PreviewPanel from "../PreviewComponent/PreviewPanel";
import { setList } from "../../redux/reducers/elementReducer";
import { ElementContext } from "../../context/ElementContext";
import { setMessages } from "../../redux/reducers/messageReducer";
import { setState } from "../../redux/reducers/formReducer";
import { createElements } from "../../utils/helpers/createElements";
import Loader from "../LoaderSkeleton/Loader";

const ReviewCreateStep = ({ prevStep, formData }) => {
  console.log("FINAL", formData);
  const [elementContextList, setElementsContextList] = useState([
    formData.contentElements,
  ]);
  const [elementsList, setElementsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const { deleteElement } = useContext(ElementContext);
  const { currentUser, dispatch, currentMessages } = useRedux();

  const handleClicked = (element) => {
    deleteElement(element);

    setElementsContextList((prevItems) =>
      prevItems.filter((item) => item !== element)
    );
  };

  const updateElements = (element) => {
    setElementsContextList(element);
  };

  const handleSubmit = async () => {
    dispatch(setList({ populated: true }));
    setIsLoading(true);

    let messageObject;
    try {
      messageObject = await createMessage();
      const requestType = "create";
      console.log("ELELE", elementContextList);
      let elements = elementContextList[0];
      console.log("SSS", elements);
      const createElementsData = createElements({
        elementContextList: elements,
        messageObject,
        axiosInstance,
        requestType,
      });
      const createdElements = await createElementsData(); // Await the result

      setElementsList((prevElement) => prevElement.concat(createdElements));

      return createdElements;
    } catch (error) {
      console.log("Error creating elements:", error);
      return;
    }
  };

  const createMessage = async () => {
    let messageObjId;
    try {
      const requestData = {
        users: currentUser,
        message_name: formData.campaignInfo["name"],
        campaign_type: formData.campaignInfo["type"],
      };

      let response = await axiosInstance.post(
        "/api/create_notes/",
        requestData
      );

      if (response.status === 200) {
        dispatch(setState({ isDirty: false }));
        messageObjId = response.data.note.id;

        const newMessageList = [...currentMessages, response.data.note];
        dispatch(setMessages(newMessageList));
        setIsLoading(false);
        navigate("/home");
      } else {
        setErrorMsg("SS");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response.data.message_name);
      setIsLoading(false);
    }

    return messageObjId;
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4 p-3 bg-mainBlue border-gray-800 border-r-2 h-screen">
          <div>
            <label
              for="first_name"
              className="block mb-2 text-normal text-left font-semibold text-gray-300 dark:text-white"
            >
              Campaign name
            </label>

            <input
              type="text"
              name="from"
              disabled
              value={formData.campaignInfo["name"]}
              className="block bg-mainBlue text-white border-2 border-gray-800 mt-1 text-semibold font-normal py-2 px-4 rounded w-full"
            />
          </div>
          <div>
            <label
              for="first_name"
              className="block mb-2 text-normal text-left font-semibold text-gray-300 dark:text-white"
            >
              Campaign type
            </label>

            <input
              type="text"
              name="from"
              disabled
              value={formData.campaignInfo["type"]}
              className="block bg-mainBlue text-white border-2 border-gray-800 mt-1 text-semibold font-normal py-2 px-4 rounded w-full"
            />
          </div>
        </div>
        <div>
          <label
            for="first_name"
            className="block mb-2  text-lg text-left font-semibold text-gray-300 dark:text-white"
          >
            Content Preview
          </label>
          <hr></hr>

          <PreviewPanel
            newLook={"new"}
            handleClicked={handleClicked}
            elementContextList={formData.contentElements}
            updateElements={updateElements}
          />
        </div>

        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute bottom-36 left-24">
              <Loader loading_name={"Creating campaign..."} />
            </div>
          ) : (
            <div>
              <button
                type="submit"
                onClick={prevStep}
                className={`text-white font-medium absolute bottom-36 left-24 rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center align-bottom ${
                  elementContextList.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-ngrokBlue hover:bg-ngrokBlue/70 focus:ring-4 focus:outline-none focus:ring-blue-300"
                }`}
              >
                Back
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className={`text-white font-medium absolute bottom-36 rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center align-bottom ${
                  elementContextList.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-ngrokBlue hover:bg-ngrokBlue/70 focus:ring-4 focus:outline-none focus:ring-blue-300"
                }`}
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewCreateStep;
