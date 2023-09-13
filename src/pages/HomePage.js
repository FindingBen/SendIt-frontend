import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/Home.css";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";
import DeleteMessageModal from "../features/modal/DeleteMessageModal";
import ReactGA from "react-ga";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  let [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [listUpdated, setListUpdated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [show, setShow] = useState(false);

  const [messageId, setMessageId] = useState();
  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logOut(user, token));

  useEffect(() => {
    getNotes();
    setListUpdated(false);
    setIsLoaded(true);
  }, [listUpdated]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = notes.slice(startIndex, endIndex);

  let getNotes = async () => {
    ReactGA.event({ category: "TestHome", "action:": "submit", label: "home" });
    try {
      let response = await axiosInstance.get("/api/notes/");

      if (response.status === 200) {
        setNotes(response?.data);
        setIsLoaded(false);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut(user, token));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = (id) => {
    setMessageId(id);
    setShow(true);
  };

  console.log("node:", process.env.NODE_ENV);
  return (
    <section className="vh-100 w-100">
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center">
          <div
            id="secondDiv"
            className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
            style={{
              backgroundColor: "#3d3e40",
              width: "95%",
            }}
          >
            <div className="row">
              <div className="col">
                <h1
                  className="text-3xl mb-2 mt-3 text-gray-300 text-left text-custom"
                  // id="textContent"
                >
                  Home dashboard
                </h1>
              </div>
              <div className="col">
                <h1
                  className="text-2xl mb-2 mt-3 text-gray-200 text-right text-custom"
                  // id="textContent"
                >
                  Sms credit count: 0
                </h1>
              </div>
            </div>
          </div>

         

          <h1 className="text-2xl mb-5 mt-5 text-gray-300">Message contents</h1>

          <div
            class="items-center justify-center rounded-lg mb-3 border-1 border-gray-600"
            style={{ backgroundColor: "#3d3e40", width: "95%" }}
          >
            <div class="col-span-12">
              <div class="overflow-auto lg:overflow-visible">
                <table class="table text-gray-200 border-separate space-y-6 text-sm">
                  <thead class="bg-gray-300 text-white">
                    <tr>
                      <th class="p-3">Type</th>
                      <th class="p-3">Create at</th>
                      <th class="p-3">Analytics</th>
                      <th class="p-3">Status</th>
                      <th class="p-3">Action</th>
                    </tr>
                  </thead>

                  {!isLoaded ? (
                    <tbody>
                      {displayedItems?.map((message) => (
                        <tr class="bg-gray-200">
                          <td class="p-3">
                            <div class="ml-3">
                              <div class="font-medium text-gray-200">Sms</div>
                            </div>
                          </td>
                          <td class="p-3">
                            <div className="font-medium text-gray-200 text-center">
                              {message.created_at}
                            </div>
                          </td>
                          <td class="p-3 font-bold ">
                            {message.status == "Draft" ? (
                              <p>Unavailabe</p>
                            ) : (
                              <Link
                                type="button"
                                className="hover:bg-sky-300 rounded"
                                to={`/analytics/${message.id}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="w-6 h-6"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                                  />
                                </svg>
                              </Link>
                            )}
                          </td>
                          <td class="p-3">
                            {message.status == "Draft" ? (
                              <span class="bg-red-400 text-gray-50 rounded-md px-2">
                                Draft
                              </span>
                            ) : (
                              <span class="bg-green-400 text-gray-50 rounded-md px-2">
                                Sent
                              </span>
                            )}
                          </td>
                          <td class="p-3">
                            <Link
                              className="hover:bg-sky-300 rounded"
                              type="button"
                              to={`/edit_message/${message.id}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                className="w-6 h-6 fill-blue-500"
                                style={{ border: "white 1px" }}
                              >
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill-rule="evenodd"
                                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>

                            {message.status == "sent" ? (
                              <a
                                className="hover:bg-sky-300 rounded disabled-link"
                                type="button"
                                style={{
                                  marginLeft: "2%",
                                  marginRight: "2%",
                                }}
                                to={`/sms_editor/${message.id}`}
                                // data-mdb-ripple-color="dark"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  fill="currentColor"
                                  className="w-6 h-6 fill-gray-600"
                                >
                                  <path
                                    d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </a>
                            ) : (
                              <Link
                                className="hover:bg-sky-300 rounded"
                                type="button"
                                style={{
                                  marginLeft: "2%",
                                  marginRight: "2%",
                                }}
                                to={`/sms_editor/${message.id}`}

                                // data-mdb-ripple-color="dark"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  fill="currentColor"
                                  className="w-6 h-6 fill-green-600"
                                >
                                  <path
                                    d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Link>
                            )}

                            <button
                              type="button"
                              className="hover:bg-sky-300 rounded"
                              onClick={() => deleteMessage(message.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.0"
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  )}
                </table>
              </div>
              <DeleteMessageModal
                messageId={messageId}
                showModalDelete={show}
                onClose={() => setShow(false)}
                listUpdated={listUpdated}
                setUpdated={() => setListUpdated(true)}
              />
            </div>
          </div>

          {totalPages > 1 && (
            <div>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-mdb-ripple-color="dark"
                    key={page}
                    id="paginationBtn"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <br></br>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
