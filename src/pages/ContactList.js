import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ContactList = () => {
  let { authTokens } = useContext(AuthContext);
  let [contactList, setContactList] = useState([]);
  const params = useParams();
  useEffect(() => {
    getContactList();
  }, []);

  let getContactList = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/contact_list/${params.id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      setContactList(data);
    }
  };
  return (
    <div>
      <h2>You are looking at: {contactList.list_name}</h2>
    </div>
  );
};

export default ContactList;
