import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CsvModal from "../features/modal/CsvModal";
import AddContactModal from "../features/modal/AddContactModal";
import { motion } from "framer-motion";
import "../css/ContactList.css";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const [contacts, setContacts] = useState([]);
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const token = useSelector(selectCurrentToken);
  const params = useParams();

  const rowsPerPage = 7;
  const totalPages = Math.ceil(contacts.length / rowsPerPage);
  useEffect(() => {
    getContacts();
    setIsLoading(true);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = contacts.slice(startIndex, endIndex);

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
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let deleteContact = async (id) => {
    setIsDelete(true);
    try {
      let response = await axiosInstance.delete(`/api/delete_recipient/${id}/`);
      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        console.log("deleted!");
        setIsDelete(false);
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

  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center xl:mb-3">
            <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white/50">
              Contacts
            </h3>
            <div class="inline-flex items-center space-x-2">
              <button onClick={handleModal}>
                <a
                  class="text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                  href="#"
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
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                </a>
              </button>

              <button onClick={handleCsvModal}>
                <a
                  class="text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                  href="#"
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
                      d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                    />
                  </svg>
                </a>
              </button>
            </div>
          </div>

          <div class="items-center justify-center rounded-lg mb-3 w-full">
            <div class="col-span-12">
              <div class="overflow-auto lg:overflow-visible">
                <div class="overflow-x-auto">
                  <div class="my-6">
                    <div class="grid grid-cols-5 gap-4 grid-headers bg-gray-600/50 text-white font-poppins py-2 px-4 rounded-md mb-2">
                      <div>First Name</div>
                      <div>Last Name</div>
                      <div>Email</div>
                      <div>Phone Number</div>
                      <div>Action</div>
                    </div>
                    {paginatedData?.map((rowData, index) => (
                      <div
                        key={rowData.id}
                        class="bg-darkBlue rounded-md text-white"
                      >
                        <div className="mb-2">
                          <div className={`grid grid-cols-5 gap-4 py-2 px-4`}>
                            <div>{rowData.first_name}</div>
                            <div>{rowData.last_name}</div>
                            <div>{rowData.email}</div>
                            <div>{rowData.phone_number}</div>
                            <div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => deleteContact(rowData.id)}
                                >
                                  <div>
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
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
