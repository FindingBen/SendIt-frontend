import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CreateContact = () => {
  let { authTokens, user } = useContext(AuthContext);
  let [contactList, setContactList] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    addContact();
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

  let addContact = async (e) => {
    e.preventDefault();
    let response = await fetch(
      `http://127.0.0.1:8000/api/create_contact/${params.id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({
          first_name: e.target.first_name.value,
          last_name: e.target.last_name.value,
          phone_number: e.target.phone_number.value,
          email: e.target.email.value,
          user: user.user_id,
          contact_list: contactList.id,
        }),
      }
    );
    let data = await response.json();
    console.log(data);
    if (response.status === 200) {
      console.log("Success");
      navigate(`/contact_list/${params.id}`);
    }
  };

  return (
    <div>
      <h2>Add contact</h2>
      <form onSubmit={addContact}>
        <input name="first_name" type="text" placeholder="First name" />
        <input name="last_name" type="text" placeholder="Last name" />
        <input name="phone_number" type="number" placeholder="Phone number" />
        <input name="email" placeholder="Email" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default CreateContact;
