import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import { selectCurrentToken } from "../features/auth/authSlice";
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
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5 mt-2">
              <h1 className="text-3xl font-bold text-gray-800">
                Contact lists
              </h1>
            </div>
            <hr></hr>
            <div className="col-12 mt-3">
              {contactList.length > 0 ? (
                <ul id="ulItem">
                  {contactList.map((conList) => (
                    <li
                      key={conList.id}
                      className="mb-3 dark:hover:bg-gray-400"
                    >
                      <div className="bg-gray-800 rounded-lg">
                        <div className="static" style={{ height: "50px" }}>
                          <div
                            className="inline-block text-1xl font-bold mb-4"
                            style={{
                              float: "left",
                              marginTop: "10px",
                              marginLeft: "4px",
                            }}
                          >
                            {conList.list_name}
                          </div>
                          {/* <div className="text-muted">
                          Number of recepients:{conList.leng}
                        </div> */}
                          <div
                            className="inline-block"
                            style={{ marginRight: "10px", marginTop: "10px" }}
                          >
                            <Link to={`/contact_list/${conList.id}`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 fill-blue-500"
                              >
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path
                                  fill="evenodd"
                                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* <span className="badge rounded-pill badge-success">Active</span> */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  You dont have any Contact list currently, click here to add
                  some:{" "}
                  <Link
                    class="text-gray-100 bg-gray-800 border border-gray-300 focus:outline-none hover:bg-gray-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    to={`/create_list`}
                  >
                    Add contacts +
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
