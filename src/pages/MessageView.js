import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom";
import ViewList from "../components/ViewList";
import { config } from "../constants/Constants";

const MessageView = () => {
  const [elements, setElements] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [getId, setId] = useState();
  const params = useParams();

  const BASE_URL = config.url.BASE_URL;

  useEffect(() => {
    messageView();
  }, []);
  console.log("Test");
  let messageView = async () => {
    try {
      setId(params.id);
      let response = await fetch(`${BASE_URL}/api/message_view/${params.id}/`);
      const data = await response.json();

      setElements(data.elements);
      setIsLoaded(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="min-h-screen bg-white flex-d w-100 items-center justify-center">
      <div className="flex flex-col items-stretch">
        <div className="mx-4 p-5">
          <ViewList children={elements} style={{ width: "100%" }}></ViewList>
        </div>
      </div>
    </section>
  );
};

export default MessageView;
