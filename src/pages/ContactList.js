import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CsvModal from "../features/modal/CsvModal";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  let [contacts, setContacts] = useState([]);
  const [show, setShow] = useState(false);
  const token = useSelector(selectCurrentToken);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getContacts();
  }, []);

  let getContacts = async () => {
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

      if (response.status === 200) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let deleteContact = async (id) => {
    try {
      let response = await axiosInstance.delete(
        `http://localhost:8000/api/delete_recipient/${id}/`
      );
      if (response.status === 200) {
        console.log("deleted!");
      }
    } catch (error) {}
  };

  const handleModal = (e) => {
    setShow(true);
  };

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4">List of recepients</h1>
              <Link
                className="btn btn-dark"
                to={`/create_contact/${params.id}`}
              >
                Add contacts +
              </Link>
              <button className="btn btn-dark" onClick={handleModal}>
                upload contacts +
              </button>
            </div>
            <div className="col">
              <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-900"
                      >
                        First name
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-900"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-900"
                      >
                        Phone Number
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 border-t border-gray-100">
                    {contacts.map((conList) => {
                      return (
                        <tr class="hover:bg-gray-50">
                          <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
                            {/* <div class="relative h-10 w-10">
                              <img
                                class="h-full w-full rounded-full object-cover object-center"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                              />
                              <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                            </div> */}
                            <div class="text-sm">
                              <div class="font-medium text-gray-700">
                                {conList.first_name}
                              </div>
                              {/* <div class="text-gray-400">jobs@sailboatui.com</div> */}
                            </div>
                          </th>
                          <td class="text-sm">
                            <div class="font-medium text-gray-700">
                              {conList.last_name}
                            </div>
                          </td>
                          <td class="px-6 py-4">{conList.phone_number}</td>
                          <td class="px-6 py-4">
                            <div class="flex gap-2">
                              {/* <span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                            Design
                          </span>
                          <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                            Product
                          </span>
                          <span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                            Develop
                          </span> */}
                              {conList.email}
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="flex justify-end gap-4">
                              <button
                                type="button"
                                onClick={() => deleteContact(conList.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="h-6 w-6"
                                  x-tooltip="tooltip"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                              {/* <a x-data="{ tooltip: 'Edite' }" href="#">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="h-6 w-6"
                                  x-tooltip="tooltip"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                  />
                                </svg>
                              </a> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* <table className="table-auto hover:table-fixed">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone number</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((conList) => {
                    return (
                      <tr key={conList.id}>
                        <td>{conList.first_name}</td>
                        <td>{conList.last_name}</td>
                        <td>{conList.phone_number}</td>
                        <td>{conList.email}</td>
                        <button
                          type="button"
                          onClick={() => deleteContact(conList.id)}
                          style={{ marginRight: "10px" }}
                          // data-mdb-ripple-color="dark"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 fill-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}

              {/* <ul className="list-group list-group-light">
                {contacts.map((conList) => (
                  <div
                    style={{ marginLeft: "24%" }}
                    key={conList.id}
                    class="w-50 flex items-center space-x-4 rounded-md border-solid border-1 bg-gray-100 mb-2"
                  >
                    <div class="flex-shrink-0" style={{ marginLeft: "10px" }}>
                      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {conList.first_name}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {conList.email}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {conList.phone_number}
                      </p>
                    </div>
                    <div class="flex-1 min-w-0"></div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-white">
                      <button
                        type="button"
                        onClick={() => deleteContact(conList.id)}
                        style={{ marginRight: "10px" }}
                        // data-mdb-ripple-color="dark"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 fill-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </ul> */}
            </div>
          </div>
          <CsvModal showModal={show} onClose={() => setShow(false)}></CsvModal>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
