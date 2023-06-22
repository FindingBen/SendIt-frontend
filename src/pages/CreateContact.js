import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import jwt_decode from "jwt-decode";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { useSelector } from "react-redux";
const CreateContact = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  // let { authTokens, user } = useContext(AuthContext);
  let [contactList, setContactList] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  useEffect(() => {
  
    getContactList();
  }, []);

  let getContactList = async () => {
    let response = await axiosInstance.get(
      `http://127.0.0.1:8000/api/contact_list/${params.id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    
   // let data = await response.json();
    if (response.status === 200) {
      setContactList(response.data);
    }
  };

  const addContact = async (e) => {
    e.preventDefault()
    let response = await axiosInstance.post(
      `http://127.0.0.1:8000/api/create_contact/${params.id}/`,
      {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        phone_number: e.target.phone_number.value,
        email: e.target.email.value,
        user: user,
        contact_list: contactList.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );


    console.log(response)
    if (response.status === 200 || 201) {
      navigate(`/contact_list/${params.id}`);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <h2>Add contact</h2>
              <hr></hr>
            </div>
            <div className="col">
             
                <form onSubmit={addContact}>
                <input name="first_name" type="text" placeholder="First name"/>
                <input name="last_name" type="text" placeholder="Last name" />
                <input
                  name="phone_number"
                  type="number"
                  placeholder="Phone number"
                />
                <input name="email" placeholder="Email" />
                <button type="submit">Create</button>
                </form>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateContact;
