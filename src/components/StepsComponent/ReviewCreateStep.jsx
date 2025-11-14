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

      let elements = elementContextList[0];

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

      setErrorMsg(error.response.data.message_name);
      setIsLoading(false);
    }

    return messageObjId;
  };

  return (
    <section className="flex flex-col min-h-screen bg-[#0A0E1A] text-gray-200 p-6">
  <div className="flex-1 flex justify-center items-start mt-16 px-4">
    <div className="w-full max-w-7xl grid grid-cols-12 gap-6">

      {/* Campaign Info Card */}
      <div className="col-span-3 flex flex-col gap-6 bg-[#111827] border-2 border-gray-800 rounded-2xl p-6">
        <h3 className="text-white text-xl font-euclid font-semibold mb-4 border-b border-gray-800 pb-2">
          Campaign Info
        </h3>
        <div className="flex flex-col gap-3">
          <label className="text-white text-sm font-medium">Campaign Name</label>
          <input
            type="text"
            value={formData.campaignInfo.name}
            disabled
            className="w-full p-2 rounded-xl bg-[#1F2937] text-white border-2 border-gray-800 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-white text-sm font-medium">Campaign Type</label>
          <input
            type="text"
            value={formData.campaignInfo.type}
            disabled
            className="w-full p-2 rounded-xl bg-[#1F2937] text-white border-2 border-gray-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Content Preview */}
      <div className="col-span-5 flex flex-col gap-4">
        <div className="bg-[#111827] border-2 border-gray-800 rounded-2xl p-4 min-h-[500px]">
          <h3 className="text-white text-xl font-euclid font-semibold mb-4 border-b border-gray-800 pb-2">
          Campaign Preview
        </h3>
          <PreviewPanel
            newLook={"new"}
            handleClicked={handleClicked}
            elementContextList={formData.contentElements}
            updateElements={updateElements}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-4 flex flex-col justify-end relative">
        {isLoading ? (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <Loader loading_name={"Creating campaign..."} />
          </div>
        ) : (
          <div className="flex gap-4 absolute bottom-10 left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={prevStep}
              disabled={elementContextList.length === 0}
              className={`text-white font-medium rounded-xl px-5 py-2.5 w-32 text-center transition ${
                elementContextList.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-ngrokBlue hover:bg-ngrokBlue/70 focus:ring-4 focus:outline-none focus:ring-blue-300"
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={elementContextList.length === 0}
              className={`text-white font-medium rounded-xl px-5 py-2.5 w-32 text-center transition ${
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
  </div>
</section>

  );
};

export default ReviewCreateStep;
