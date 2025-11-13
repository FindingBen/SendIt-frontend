import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import CsvModal from "../features/modal/CsvModal";
import ShopifyUsersImportModal from "../features/modal/ShopifyUsersImportModal";
import AddContactModal from "../features/modal/AddContactModal";
import "../css/ContactList.css";
import { Tooltip } from "react-tooltip";
import { setContactLists } from "../redux/reducers/contactListReducer";
import { useRedux } from "../constants/reduxImports";
import ShowQrModal from "../features/modal/ShowQrModal";
import SvgLoader from "../components/SvgLoader";
import LoaderSkeleton from "../components/LoaderSkeleton/LoaderSkeleton";
import Loader from "../components/LoaderSkeleton/Loader";
import SmsPill from "../components/SmsPill/SmsPill";
import Search from "../components/SearchComponent/Search";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const {
    currentTokenType,
    dispatch,
    currentPackageState,
    currentUserState,
    currentShopifyToken,
  } = useRedux();
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({});
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [showShopify, setShowShopify] = useState(false);
  const [showqr, setShowQr] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLoadingId, setEditingLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [loader, setLoader] = useState(true);
  const [contactId, setContactId] = useState();
  const [deletedContact, setDeletedContact] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [sortOrder, setSortOrder] = useState("first_name");
  const [editableRowId, setEditableRowId] = useState(null);
  const [shopifyList, setShopifyList] = useState(true); // Track the row being edited
  const [editData, setEditData] = useState({});
  const [search_name, setSearchName] = useState("");
  const params = useParams();
  const rowsPerPage = 7;
  const totalPages = Math.ceil(contacts?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = contacts?.slice(startIndex, endIndex);
  console.log("EMPT?",listEmpty)
  console.log("TOKEN",currentShopifyToken)
  console.log('conteact',contacts)

  useEffect(() => {
    getContacts();
  }, [sortOrder, search_name]);

  useEffect(() => {
    getContacts();
  }, [errorMsg, successMsg, deletedContact]);

  useEffect(() => {
    if (contacts?.length === 0 || contacts === undefined) {
      setListEmpty(true);
    } else {
      setListEmpty(false);
    }
  }, [contacts]);

  const handlePageChange = (page) => {
    
    setCurrentPage(page);
  
  };
  
  console.log(contacts)
  
  let getContacts = async () => {
    setIsLoading(true);
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
        setShopifyList(response.data.shopify_list);
        if (response.data.contact_list_recipients_nr === 0) {
          setListEmpty(false);
        }
        setContacts(response.data.customers);
      }
      setLoader(false);
      setIsLoading(false);
    } catch (error) {
      setLoader(false);
      setIsLoading(false);
    }
  };

  let canAddNewrecipients = () => {
    if (contacts?.length >= currentPackageState.recipients_limit) {
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

  const handleSortByDateCreatedShopify = () => {
    setSortOrder(
      sortOrder === "created_at desc" ? "created_at asc" : "created_at desc"
    );

    getContacts();
  };
  let deleteContact = async (user_data) => {
    setIsLoading(true);
    setLoadingRowId(user_data.id);
    try {
    
      const data = {
        id: user_data.custom_id,
      };

      let url = "";
      //const url = "/api/delete_recipient/<str:id>/";

      url = `/api/delete_recipient/${user_data.id}`;

      let response = await axiosInstance.post(url, data);

      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== user_data.id));
        setDeletedContact(true);
        dispatch(
          setContactLists({
            contactLists: [],
            listChange: true,
          })
        );
        setIsLoading(false);
        setLoadingRowId(null);
      }
    } catch (error) {
      setDeletedContact(false);
      setIsLoading(false);
      setLoadingRowId(null);
      setErrorMsg(error.response.data.error[0]["message"]);
      setTimeout(() => {
        setErrorMsg();
      }, 3000);
    }
  };

  const isShopifyList = (e) => {
    setShopifyList(e);
  };

  const handleCsvModal = (e) => {
    setShowCsv(true);
  };

  const handleShopifyModal = (e) => {
    setShowShopify(true);
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const handleQrModal = (e) => {
    setShowQr(true);
  };

  const handleNewContact = (contact) => {
    setListEmpty(true);
    setContacts(contact);
  };

  const updateContact = async (user_data) => {
    setLoadingRowId(user_data.id);

    try {
      const url = `/api/contact_detail/${params.id}`;
      const payload = { ...editData, id: user_data.custom_id };

      const response = await axiosInstance.put(url, payload);

      if (response.status === 200) {
        const updated = response.data;
        const updatedContacts = contacts.map((contact) =>
          contact.id === updated.id ? updated : contact
        );
        setContacts(updatedContacts);
        setSuccessMsg("Successfully updated!");
        setEditableRowId(null);
        setLoadingRowId(null);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
    } finally {
      setLoadingRowId(null);
    }
  };

  const handleSearchChange = (e) => {
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
    <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
  {/* Sticky Top Bar */}
  <div className="flex flex-row items-center h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-20 border-b border-[#1C2437]/40 px-8">
    <Search />
    <SmsPill />
  </div>

  {/* Main Content */}
  <div className="flex flex-col w-full lg:flex-row mt-6 ml-20 px-44">
    <div className="flex-1 flex flex-col space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={"/contact_lists"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-white hover:text-[#3E6FF4]/80 cursor-pointer"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h2 className="text-2xl font-semibold tracking-wide text-gray-100">Contacts</h2>
        </div>

        <div className="flex items-center gap-3">
          {currentShopifyToken && !currentUserState.shopify_connect && listEmpty && (
            <button
              onClick={handleShopifyModal}
              className="bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] px-4 py-2 rounded-lg shadow-md text-white hover:opacity-90 transition-all"
            >
              Shopify Customers
            </button>
          )}

          <button
            onClick={handleQrModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 hover:bg-[#242E44] transition-all"
          >
            Show Code
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            </svg>
          </button>

          <button
            disabled={!canAddNewrecipients()}
            onClick={handleModal}
            className={`px-4 py-2 rounded-lg ${
              canAddNewrecipients()
                ? "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white shadow-md hover:opacity-90 transition-all"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            Add Contact
          </button>

          {!shopifyList && (
            <button
              disabled={!canAddNewrecipients()}
              onClick={handleCsvModal}
              className={`px-4 py-2 rounded-lg ${
                canAddNewrecipients()
                  ? "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] text-white shadow-md hover:opacity-90 transition-all"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Import CSV
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] overflow-x-auto">
        {/* Filters */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 space-x-4">
          {!currentShopifyToken && (
            <>
              <button
                onClick={handleSortByName}
                className="px-3 py-2 rounded-lg border border-gray-800 bg-[#111827] hover:bg-[#3E6FF4]/10 transition"
              >
                Sort by Name
              </button>
              <button
                onClick={currentTokenType === "Shopify" ? handleSortByDateCreatedShopify : handleSortByDateCreated}
                className="px-3 py-2 rounded-lg border border-gray-800 bg-[#111827] hover:bg-[#3E6FF4]/10 transition"
              >
                Sort by Date
              </button>
            </>
          )}

          <div className="relative w-1/5">
            <input
              type="search"
              placeholder="Search by name..."
              value={search_name}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 ps-10 rounded-lg bg-[#111827] border border-gray-800 text-white focus:outline-none"
            />
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-4 py-2 text-gray-300 font-medium border-b border-gray-700">
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>SMS Consent</div>
          <div>Phone</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {!loader
          ? paginatedData?.map((row) => {
              const isEditing = editableRowId === row.id;
              const isDisabled = row.allowed === false;
              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-700 items-center text-gray-200 ${
                    isDisabled ? "opacity-50 pointer-events-none" : "hover:bg-[#3E6FF4]/10 transition-all"
                  }`}
                >
                  {["firstName", "lastName", "email", "sms_opt_in", "phone"].map((field) => (
                    <div key={field}>
                      {isEditing && !isDisabled ? (
                        <input
                          value={editData[field]}
                          onChange={(e) => handleChange(e, field)}
                          className="w-full px-2 py-1 rounded-lg bg-[#1B2233] border border-gray-600 text-white"
                        />
                      ) : (
                        <span>{row[field]}</span>
                      )}
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {isEditing && !isDisabled ? (
                      <>
                        <button onClick={() => updateContact(row)} className="text-green-400 hover:text-green-500">
                          Save
                        </button>
                        <button onClick={() => setEditableRowId(null)} className="text-gray-400 hover:text-white">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        {!isDisabled && (
                          <button onClick={() => handleEditClick(row)} className="text-blue-400 hover:text-blue-500">
                            Edit
                          </button>
                        )}
                        <button onClick={() => deleteContact(row)} className="text-red-400 hover:text-red-500">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          : <LoaderSkeleton div_size={3} />}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className="px-3 py-1 rounded-md border border-gray-700 bg-[#1B2233] hover:bg-[#3E6FF4]/20 transition"
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      <CsvModal newContacts={handleNewContact} showModalCsv={showCsv} shopifyList={isShopifyList} onClose={() => setShowCsv(false)} />
      <AddContactModal newContacts={handleNewContact} showModal={show} onClose={() => setShow(false)} />
      <ShowQrModal showModalQr={showqr} onClose={() => setShowQr(false)} />
      <ShopifyUsersImportModal showShopify={showShopify} onClose={() => setShowShopify(false)} bulkContacts={handleNewContact} />
    </div>
  </div>
</section>

  );
};

export default ContactList;
