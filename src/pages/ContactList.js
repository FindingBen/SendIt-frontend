import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import CsvModal from "../features/modal/CsvModal";
import AddContactModal from "../features/modal/AddContactModal";
import "../css/ContactList.css";
import { Tooltip } from "react-tooltip";
import { setContactLists } from "../redux/reducers/contactListReducer";
import { useRedux } from "../constants/reduxImports";
import ShowQrModal from "../features/modal/ShowQrModal";
import SvgLoader from "../components/SvgLoader";
import LoaderSkeleton from "../components/LoaderSkeleton/LoaderSkeleton";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const { currentContactList, dispatch, currentPackageState } = useRedux();
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({});
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [showqr, setShowQr] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [loader, setLoader] = useState(true);
  const [contactId, setContactId] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [sortOrder, setSortOrder] = useState("first_name");
  const [editableRowId, setEditableRowId] = useState(null); // Track the row being edited
  const [editData, setEditData] = useState({});
  const [search_name, setSearchName] = useState("");
  const params = useParams();
  const rowsPerPage = 7;
  const totalPages = Math.ceil(contacts?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = contacts?.slice(startIndex, endIndex);

  useEffect(() => {
    getContacts();
  }, [sortOrder, contactId, editData, search_name]);

  useEffect(() => {
    getContacts();
  }, [errorMsg, successMsg]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let getContacts = async () => {
    try {
      let url = `/api/contact_list/${params.id}`;
      const queryParts = [];
      // Check if a sorting parameter is present, then include it in the URL
      // Add sorting parameter if set
      if (sortOrder) queryParts.push(`sort_by=${sortOrder}`);

      // Add search parameter if set
      if (search_name) queryParts.push(`search=${search_name}`);

      // Join query parameters and append to URL
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`;
      }
      let response = await axiosInstance.get(url);
      if (response.status === 200) {
        setContacts(response.data.contacts);
        setLoader(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setIsLoading(false);
    }
  };

  let canAddNewrecipients = () => {
    if (contacts.length >= currentPackageState.recipients_limit) {
      return false;
    }
    return true;
  };

  const handleSortByName = () => {
    setSortOrder(sortOrder === "first_name" ? "-first_name" : "first_name");

    getContacts();
  };

  // Function to handle sorting by date created
  const handleSortByDateCreated = () => {
    setSortOrder(sortOrder === "created_at" ? "-created_at" : "created_at");

    getContacts();
  };

  let deleteContact = async (id) => {
    setIsDelete(true);
    try {
      let response = await axiosInstance.delete(`/api/delete_recipient/${id}/`);
      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        setIsDelete(false);
        dispatch(
          setContactLists({
            contactLists: [],
            listChange: true,
          })
        );
      }
    } catch (error) {}
  };

  const handleCsvModal = (e) => {
    setShowCsv(true);
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const handleQrModal = (e) => {
    setShowQr(true);
  };

  const handleNewContact = (contact) => {
    setContacts(contact);
  };

  const updateContact = async (contact_id) => {
    console.log(editData);
    setIsLoading(true);
    try {
      let response = await axiosInstance.put(
        `/api/contact_detail/${contact_id}`,
        editData
      );

      if (response.status === 200) {
        // Assuming the API returns the updated contact object
        setContact(response.data);
        setSuccessMsg("Successfully updated!");
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

        setEditableRowId(null);

        // Close the contact drawer after successful update
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
      setIsLoading(false);
      setTimeout(() => {
        setErrorMsg("");
      }, 6000);
      setEditableRowId(null);
    }
  };

  const handleSearchChange = (e) => {
    console.log(e.target.value);
    setSearchName(e.target?.value);
  };

  const handleEditClick = (rowData) => {
    setErrorMsg("");
    setEditableRowId(rowData.id);
    setEditData({ ...rowData }); // Initialize with existing row data
  };

  const handleChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center">
      <div className="flex-1 flex flex-col space-y-5 lg:flex-row">
        <div className="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue">
            <h3 class="xl:text-2xl text-xl font-semibold text-left text-white mx-20">
              Contacts
            </h3>
            <div class="items-start shadow-md mx-20">
              <div className="inline-flex mt-1 gap-2">
                <button
                  className={`text-white hover:text-white/50 ml-5 smooth-hover transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 cursor-pointer
                  rounded-md flex flex-row gap-2 border-2 border-gray-800 p-2`}
                  onClick={handleQrModal}
                >
                  <p>Show code</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                    />
                  </svg>
                </button>

                <button
                  disabled={!canAddNewrecipients()}
                  onClick={handleModal}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Limit reached! Upgrade for more recipients!"
                  className={`${
                    canAddNewrecipients()
                      ? "text-white hover:text-white/50 smooth-hover transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      : "text-gray-500"
                  } rounded-md border-2 border-gray-800 p-2`}
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
                  {!canAddNewrecipients() && <Tooltip id="my-tooltip" />}
                </button>

                <button
                  disabled={!canAddNewrecipients()}
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Limit reached! Upgrade for more recipients!"
                  className={`${
                    canAddNewrecipients()
                      ? "text-white hover:text-white/50 smooth-hover transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 cursor-pointer"
                      : "text-gray-500"
                  } rounded-md border-2 border-gray-800 p-2`}
                  onClick={handleCsvModal}
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
                  {!canAddNewrecipients() && <Tooltip id="my-tooltip" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mx-20">
            {/* <p className="mx-auto text-red-600 font-semibold">Error</p> */}
            <div className={`mainContainer w-full`}>
              <div class="items-center justify-center rounded-2xl mb-3 w-full bg-mainBlue border-gray-800 border-2 shadow-md">
                <div className="flex flex-row space-x-2 p-2 border-b border-gray-800">
                  <button
                    className={`px-2 text-normal 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white hover:bg-cyan-500 font-semibold duration-200 rounded-lg border-2 border-gray-800 bg-darkestGray
                  `}
                    onClick={handleSortByName}
                  >
                    Sort by Name
                  </button>
                  <button
                    className={`px-2 text-normal 2xl:text-xl py-1 2xl:px-4 2xl:py-2 text-white hover:bg-cyan-500 font-semibold duration-200 rounded-lg border-2 border-gray-800 bg-darkestGray
                      `}
                    onClick={handleSortByDateCreated}
                  >
                    Sort by Date
                  </button>
                  <div class="relative w-[20%]">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 ml-2 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      class="block w-full p-1.5 ps-10 text-sm border-2 rounded-lg focus:border-gray-700 bg-darkestGray border-gray-800 text-white"
                      placeholder="Search by name..."
                      value={search_name}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                <div>
                  <div class="grid grid-cols-5 gap-4 grid-headers text-white/50 font-semibold text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
                    <div>First Name</div>
                    <div>Last Name</div>
                    <div>Email</div>
                    <div>Phone number</div>
                    <div>Action</div>
                  </div>
                  {!loader ? (
                    <>
                      {paginatedData?.map((rowData, index) => {
                        const isLastItem = index === paginatedData.length - 1;
                        const evenRow = index % 2 === 0;
                        const isEditing = editableRowId === rowData.id;
                        return (
                          <div
                            key={rowData.id}
                            className={`${
                              contactId === rowData.id
                                ? "bg-cyan-700 text-white font-semibold transition duration-300"
                                : evenRow
                                ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue text-white"
                                : "bg-mainBlue text-white"
                            } ${
                              isLastItem ? "rounded-b-2xl border-none" : ""
                            } font-light`}
                          >
                            <div
                              className={`grid grid-cols-5 font-semibold 2xl:text-lg gap-4 p-2 border-b-2 border-gray-800 ${
                                isLastItem
                                  ? "rounded-b-2xl 2xl:text-lg border-none"
                                  : ""
                              }`}
                            >
                              <div>
                                {isEditing ? (
                                  <input
                                    value={editData.first_name}
                                    onChange={(e) =>
                                      handleChange(e, "first_name")
                                    }
                                    className="input-class rounded-lg bg-white text-black"
                                  />
                                ) : (
                                  rowData.first_name
                                )}
                              </div>
                              <div>
                                {isEditing ? (
                                  <input
                                    value={editData.last_name}
                                    onChange={(e) =>
                                      handleChange(e, "last_name")
                                    }
                                    className="input-class rounded-lg bg-white text-black"
                                  />
                                ) : (
                                  rowData.last_name
                                )}
                              </div>
                              <div>
                                {isEditing ? (
                                  <input
                                    value={editData.email}
                                    onChange={(e) => handleChange(e, "email")}
                                    className="input-class rounded-lg bg-white text-black"
                                  />
                                ) : (
                                  rowData.email
                                )}
                              </div>
                              <div>
                                {isEditing ? (
                                  <input
                                    value={editData.phone_number}
                                    onChange={(e) =>
                                      handleChange(e, "phone_number")
                                    }
                                    className="input-class rounded-lg bg-white text-black"
                                  />
                                ) : (
                                  rowData.phone_number
                                )}
                              </div>

                              {isEditing ? (
                                <div className="flex flex-row mx-16 mt-1">
                                  {!isLoading ? (
                                    <button
                                      onClick={(e) => updateContact(rowData.id)}
                                      className="text-green-500 hover:text-green-700 mx-auto p-0.5"
                                    >
                                      Save
                                    </button>
                                  ) : (
                                    <div className="mx-auto p-0.5">
                                      <SvgLoader width={5} height={5} />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-row mx-16 mt-1">
                                  <div className="mx-auto my-auto p-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleEditClick(rowData)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-5 h-5 2xl:w-7 2xl:h-7 hover:bg-cyan-400 duration-150 rounded-md"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="mx-auto my-auto p-0.5">
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
                                        class="h-5 w-5 2xl:w-7 2xl:h-7 hover:bg-red-500/95 duration-150 rounded-md"
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
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <LoaderSkeleton div_size={3} />
                  )}
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <div
                    className="btn btn-outline-secondary ml-2 bg-darkBlue"
                    data-mdb-ripple-color="dark"
                    key={page}
                    id="paginationBtn"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </div>
                ))}
                <br></br>
              </div>
            )}
          </div>
          <p className="mx-auto text-red-600 font-semibold">{errorMsg}</p>
          <p className="mx-auto text-green-600 font-semibold">{successMsg}</p>
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
          <ShowQrModal showModalQr={showqr} onClose={() => setShowQr(false)} />
        </div>
      </div>
    </section>
  );
};

export default ContactList;
