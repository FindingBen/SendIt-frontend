import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ContactList = () => {
  let { authTokens } = useContext(AuthContext);
  let [contacts, setContacts] = useState([]);

  const params = useParams();
  useEffect(() => {
    getContacts();
  }, []);

  let getContacts = async () => {
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
      setContacts(data);
    }
  };
  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <h2>Contact list</h2>
              <Link to={`/create_contact/${params.id}`}>Add contacts +</Link>
            </div>
            <div className="col">
              <ul class="list-group list-group-light">
                {contacts.map((conList) => (
                  <li
                    key={conList.id}
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div class="fw-bold">{conList.first_name}</div>
                      <div class="text-muted">{conList.email}</div>
                    </div>
                    {/* <span class="badge rounded-pill badge-success">Active</span> */}
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
