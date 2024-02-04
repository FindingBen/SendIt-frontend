import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import CsvModal from "../features/modal/CsvModal";
import AddContactModal from "../features/modal/AddContactModal";
import "../css/ContactList.css";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({});
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [contactId, setContactId] = useState();
  const [first_name, setFirstName] = useState(contact?.first_name);
  const [last_name, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phone_number, setPhoneNumber] = useState();
  const [openContact, setOpenContact] = useState(false);
  const [sortOrder, setSortOrder] = useState("first_name");
  const params = useParams();

  const rowsPerPage = 7;
  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = contacts.slice(startIndex, endIndex);

  useEffect(() => {
    getContacts();
    setIsLoading(true);
  }, [sortOrder, contactId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let getContacts = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/contact_list/${params.id}/?sort_by=${sortOrder}`
      );

      if (response.status === 200) {
        setContacts(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let getContact = async (id) => {
    try {
      let response = await axiosInstance.get(`/api/contact_detail/${id}`);
      if (response.status === 200) {
        setContact(response.data);
      }
    } catch (error) {}
  };

  const handleSortByName = () => {
    setSortOrder(sortOrder === "first_name" ? "-first_name" : "first_name");
  };

  // Function to handle sorting by date created
  const handleSortByDateCreated = () => {
    setSortOrder(sortOrder === "created_at" ? "-created_at" : "created_at");
  };

  let deleteContact = async (id) => {
    setIsDelete(true);
    try {
      let response = await axiosInstance.delete(`/api/delete_recipient/${id}/`);
      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== id));
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

  const toggleContactDrawer = (id) => {
    getContact(id);
    setOpenContact(true);
    setContactId(id);
  };

  const closeContactDrawer = () => {
    setOpenContact(false);
    setContactId();
  };

  const updateContact = async () => {
    try {
      const updatedContact = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
      };

      let response = await axiosInstance.put(
        `/api/contact_detail/${contactId}`,
        updatedContact
      );

      if (response.status === 200) {
        // Assuming the API returns the updated contact object
        setContact(response.data);

        // Close the contact drawer after successful update
        closeContactDrawer();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="min-h-screen flex-d w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center xl:mb-3">
            <h3 class="xl:text-3xl text-2xl font-extralight text-left text-white">
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

          <div
            className={`mainContainer transition-width ${
              openContact ? "w-[72%]" : "w-full"
            }`}
          >
            <div class="items-center justify-center rounded-2xl mb-3 w-full bg-darkBlue p-2">
              <div className="flex flex-row space-x-2">
                <button
                  className={`px-2 py-1 text-white font-light hover:bg-slate-500 duration-200 rounded-lg bg-darkestGray ${
                    sortOrder === "first_name" ? "bg-gray-700" : ""
                  }`}
                  onClick={handleSortByName}
                >
                  Sort by Name
                </button>
                <button
                  className={`px-2 py-1 text-white font-light hover:bg-slate-500 duration-200 rounded-lg bg-darkestGray ${
                    sortOrder === "created_at" ? "bg-gray-700" : ""
                  }`}
                  onClick={handleSortByDateCreated}
                >
                  Sort by Date Created
                </button>
              </div>
              <div class="overflow-auto lg:overflow-visible">
                <div class="overflow-x-auto">
                  <div class="my-6">
                    <div class="grid grid-cols-5 gap-4 grid-headers bg-darkBlue text-white font-light py-2 px-4 rounded-2xl mb-2">
                      <div>First Name</div>
                      <div>Last Name</div>
                      <div>Email</div>
                      <div>Phone Number</div>
                      <div>Action</div>
                    </div>
                    {paginatedData?.map((rowData, index) => (
                      <div
                        key={rowData.id}
                        className={`border-b border-gray-700 ${
                          contactId === rowData.id
                            ? "bg-white text-black font-normal rounded-lg"
                            : "text-white"
                        } font-light`}
                      >
                        <div className="mb-2">
                          <div className={`grid grid-cols-5 gap-4 py-2 px-4`}>
                            <div>{rowData.first_name}</div>
                            <div>{rowData.last_name}</div>
                            <div>{rowData.email}</div>
                            <div>{rowData.phone_number}</div>

                            <div>
                              <button
                                type="button"
                                onClick={() => toggleContactDrawer(rowData.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.0"
                                  stroke="currentColor"
                                  class="w-6 h-6 hover:bg-gray-950 duration-200 rounded"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  />
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteContact(rowData.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="0.5"
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute top-[14%] xl:top-[12%] -right-6 h-[526px] w-[340px] xl:h-[648px] xl:w-[440px] bg-darkBlue rounded-2xl transition-transform transform ${
              openContact
                ? "xl:-translate-x-20 lg:-translate-x-16"
                : "translate-x-full"
            }`}
          >
            <div className="flex flex-col p-4 relative items-center">
              <button
                className="bg-darkBlue hover:bg-gray-700 duration-300 text-white px-2 rounded-full absolute right-3 top-3"
                onClick={closeContactDrawer}
              >
                X
              </button>
              <p className="text-white text-xl mb-2">Quick view and edit</p>

              <div className="flex flex-col items-center p-4 w-full h-[150px] rounded-lg">
                <div className="flex flex-col gap-3 relative">
                  <input
                    className={`block ${"bg-darkGray border-white/50 border-solid hover:bg-gray-700 text-light font-light py-2 px-4 duration-200 rounded-xl"}`}
                    defaultValue={contact?.first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                  ></input>
                  <input
                    className="block bg-darkGray border-white/50 border-solid hover:bg-gray-700 text-light font-light py-2 px-4 duration-200 rounded-xl"
                    defaultValue={contact?.last_name}
                    onChange={(e) => setLastName(e.target.value)}
                  ></input>
                  <input
                    className="block bg-darkGray border-white/50 border-solid hover:bg-gray-700 text-light font-light py-2 px-4 duration-200 rounded-xl"
                    defaultValue={contact?.email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                  <input
                    className="block bg-darkGray border-white/50 border-solid hover:bg-gray-700 text-light font-light py-2 px-4 duration-200 rounded-xl"
                    defaultValue={contact?.phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  ></input>
                </div>
                <button
                  onClick={updateContact}
                  className="bg-darkBlue hover:bg-gray-700 duration-300 px-2 py-1 mt-2 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          {totalPages > 1 && (
            <div>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <div
                    className="btn btn-outline-secondary ml-2 bg-darkBlue"
                    data-mdb-ripple-color="dark"
                    key={page}
                    id="paginationBtn"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </div>
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
