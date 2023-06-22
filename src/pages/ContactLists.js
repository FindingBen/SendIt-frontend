import React, {  useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  selectCurrentToken,
} from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  let [contactList, setContactList] = useState([]);

  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    getContactLists();
  }, []);

  let getContactLists = async () => {

    let response = await axiosInstance.get("/contact_lists/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
    });
    if (response.status === 200) {
      setContactList(response.data);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="row">
            <div class="col-12">
              <h1>header</h1>
            </div>
            <div class="col-12">
              <ul class="list-group list-group-light">
                {contactList.map((conList) => (
                  <li
                    key={conList.id}
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div class="fw-bold">{conList.list_name}</div>
                      <div class="text-muted">john.doe@gmail.com</div>
                    </div>
                    {/* <span class="badge rounded-pill badge-success">Active</span> */}
                    <Link to={`/contact_list/${conList.id}`}>View</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
