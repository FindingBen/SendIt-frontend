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

  //const BASE_URL = "https://sendit-backend-production.up.railway.app";

  useEffect(() => {
    messageView();
  }, []);
  console.log("Test");
  let messageView = async () => {
    setId(params.id);
    //https://stingray-app-9825w.ondigitalocean.app
    let response = await fetch(`${BASE_URL}/api/message_view/${params.id}/`);
    console.log(response);
    const data = await response.json();

    setElements(data.elements);
    setIsLoaded(false);
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
