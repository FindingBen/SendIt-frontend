import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CsvModal from "../features/modal/CsvModal";
import AddContactModal from "../features/modal/AddContactModal";
import ReactPaginate from "react-paginate";
import "../css/ContactList.css";
import useAnalyticsEventTracker from "../utils/useAnalyticsEventTracker";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const [contacts, setContacts] = useState([]);
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const params = useParams();
  const navigate = useNavigate();
  const rowsPerPage = 8;
  const gaEventTracker = useAnalyticsEventTracker("Add contact");
  useEffect(() => {
    getContacts();
  }, []);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * rowsPerPage;
  const paginatedData = contacts.slice(offset, offset + rowsPerPage);

  let getContacts = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/contact_list/${params.id}/`,
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
      let response = await axiosInstance.delete(`/api/delete_recipient/${id}/`);
      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        console.log("deleted!");
      }
    } catch (error) {}
  };

  const handleCsvModal = (e) => {
    setShowCsv(true);
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const handleNewContact = (contact) => {
    setContacts(contact);
  };
  console.log("SS");
  console.log(paginatedData);
  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5 mt-3">
              <h1 className="text-3xl mb-4 text-gray-300">
                List of recepients
              </h1>
              <div>
                <button className="btn btn-dark" onClick={handleModal}>
                  Add contacts +
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => gaEventTracker("track")}
                >
                  Track
                </button>

                <button className="btn btn-dark" onClick={handleCsvModal}>
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
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col">
              <div class="overflow-hidden rounded-lg border border-gray-200 m-5">
                <table class="w-full bg-white text-left text-sm text-gray-200">
                  <thead class="bg-gray-50 text-gray-200">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-4 font-medium text-gray-200"
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
                    {paginatedData.map((rowData) => (
                      <tr class="hover:bg-gray-50" key={rowData.id}>
                        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
                          <div class="text-sm">
                            <div class="font-medium text-gray-200">
                              {rowData.first_name}
                            </div>
                            {/* <div class="text-gray-400">jobs@sailboatui.com</div> */}
                          </div>
                        </th>
                        <td class="text-sm">
                          <div class="font-medium text-gray-200">
                            {rowData.last_name}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="font-medium text-gray-200">
                            {rowData.phone_number}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex gap-2">
                            <div class="font-medium text-gray-200">
                              {rowData.email}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex justify-end gap-4 text-red-400">
                            <button
                              type="button"
                              onClick={() => deleteContact(rowData.id)}
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                pageCount={Math.ceil(contacts.length / rowsPerPage)}
                pageRangeDisplayed={3} // Number of pages to display in the pagination control
                marginPagesDisplayed={1} // Number of pages to display before and after the active page
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
          <CsvModal
            newContacts={handleNewContact}
            showModalCsv={showCsv}
            onClose={() => setShowCsv(false)}
          />
          <AddContactModal
            newContacts={handleNewContact}
            showModal={show}
            onClose={() => setShow(false)}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactList;
