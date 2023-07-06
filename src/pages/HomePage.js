import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../css/EditMessage.css";
import { CSSTransition } from "react-transition-group";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCouch,
  faFileImport,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBTypography,
} from "mdb-react-ui-kit";
import "../css/Home.css";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import useAxiosInstance from "../utils/axiosInstance";

const HomePage = () => {
  const axiosInstance = useAxiosInstance();
  let [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logOut(user, token));

  const params = useParams();
  useEffect(() => {
    getNotes();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = notes.slice(startIndex, endIndex);
  console.log(user);
  let getNotes = async () => {
    try {
      let response = await axiosInstance.get("/notes/");

      if (response.status === 200) {
        setNotes(response?.data);
      } else if (response.statusText === "Unauthorized") {
        dispatch(logOut(user, token));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <h1 className="text-3xl font-bold mb-4">Overall statistics</h1>
            </div>
          </div>
          <div
            className="static bg-indigo-400 rounded-lg p-3 shadow-xl"
            style={{ width: "97%" }}
          >
            <div
              class="inline-block max-w-sm p-4 bg-gray-500 rounded-lg shadow hover:bg-gray-400"
              style={{ marginLeft: "12px" }}
            >
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                Open rate in % for messages
              </h5>
              <p className="text-white">To be added...</p>
            </div>
            <div
              class="inline-block max-w-sm p-4 bg-gray-500 rounded-lg shadow hover:bg-gray-400"
              style={{ marginLeft: "12px" }}
            >
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                Open rate in % for messages
              </h5>
              <p className="text-white">To be added...</p>
            </div>
            <div
              class="inline-block max-w-sm p-4 bg-gray-500 rounded-lg shadow hover:bg-gray-400"
              style={{ marginLeft: "12px" }}
            >
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                Open rate in % for messages
              </h5>
              <p className="text-white">To be added...</p>
            </div>
          </div>
          <div className="row mt-5">
            <h1 className="text-2xl font-bold mb-4">Sms messages</h1>
            <div className="col">
              {!notes ? (
                <div>LOL</div>
              ) : (
                <ul id="ulItem">
                  {displayedItems?.map((note) => (
                    <li key={note.id} className="mb-3 dark:hover:bg-gray-400">
                      <div className="bg-gray-800 rounded-lg">
                        <div
                          className="static"
                          style={{ height: "45px", alignItems: "center" }}
                        >
                          <div
                            className="inline-block text-1xl font-bold mb-4"
                            style={{
                              float: "left",
                              marginTop: "10px",
                              marginLeft: "4px",
                            }}
                          >
                            SMS
                          </div>
                          <div
                            className="inline-block"
                            style={{ marginRight: "10px", marginTop: "10px" }}
                          >
                            <Link type="button" to={`/edit_message/${note.id}`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                class="w-6 h-6 fill-blue-500"
                                style={{ border: "white 1px" }}
                              >
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  fill-rule="evenodd"
                                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </Link>
                          </div>
                          <div
                            className="inline-block"
                            style={{ marginRight: "10px" }}
                          >
                            <Link
                              type="button"
                              to={`/delete_message/${note.id}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6 fill-red-500"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </Link>
                          </div>
                          <div
                            className="inline-block"
                            style={{ marginRight: "10px" }}
                          >
                            {" "}
                            <Link
                              type="button"
                              to={`/sms_editor/${note.id}`}
                              // data-mdb-ripple-color="dark"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                fill="currentColor"
                                class="w-6 h-6 fill-green-600"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {totalPages > 1 && (
                <div>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
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
                  ))}
                  <br></br>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
