import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ContactList = () => {
  let [contactList, setContactList] = useState([]);
  let { authTokens } = useContext(AuthContext);

  useEffect(() => {
    getContactLists();
  }, []);

  let getContactLists = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/contact_lists/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    console.log(data);
    if (response.status === 200) {
      setContactList(data);
    }
  };

  return (
    <div>
      <ul class="list-group list-group-light">
        {contactList.map((conList) => (
          <li
            key={conList.id}
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <div class="fw-bold">{conList.list_name}</div>
              {/* <div class="text-muted">john.doe@gmail.com</div> */}
            </div>
            {/* <span class="badge rounded-pill badge-success">Active</span> */}
            <Link to={`/contact_list/${conList.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
