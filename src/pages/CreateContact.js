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
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  const addContact = async (e) => {
    e.preventDefault();
    try {
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

      console.log(response);
      if (response.status === 200 || 201) {
        navigate(`/contact_list/${params.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 m">
              <h1 className="text-3xl font-bold mb-4">Add new contact</h1>
              <hr></hr>
            </div>
            <div className="col" style={{ marginLeft: "35%" }}>
              <div className="w-50">
                <form className="mt-2" onSubmit={addContact}>
                  <input
                    class="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="first_name"
                    type="text"
                    placeholder="First name"
                  />
                  <input
                    class="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="last_name"
                    type="text"
                    placeholder="Last name"
                  />
                  <input
                    class="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="phone_number"
                    type="number"
                    placeholder="Phone number"
                  />
                  <input
                    class="bg-gray-50 border border-gray-300 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="email"
                    placeholder="Email"
                  />
                  <button
                    className="bg-gray-800 hover:bg-green-400 mt-2 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                    type="submit"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateContact;
