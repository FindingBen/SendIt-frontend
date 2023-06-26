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
            <div class="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4">Contact lists</h1>
            </div>
            <div class="col-12">
              <ul id="ulItem">
                {contactList.map((conList) => (
                  <li
                    key={conList.id}
                    noBorders
                    className="mb-3 dark:hover:bg-gray-400"
                  >
                    <div className="bg-gray-400 rounded-lg">
                      <div className="static">
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
                        {/* <div class="text-muted">
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
                              class="w-6 h-6 fill-blue-500"
                            >
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path
                                fill-rule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
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
