import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/ContactList.css";
import useAxiosInstance from "../utils/axiosInstance";
import CreateListModal from "../features/modal/CreateListModal";
import DeleteListModal from "../features/modal/DeleteListModal";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";
import { setContactLists } from "../redux/reducers/contactListReducer";
import SmsPill from "../components/SmsPill/SmsPill";
import LoaderSkeleton from "../components/LoaderSkeleton/LoaderSkeleton";
import Search from "../components/SearchComponent/Search";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const {
    currentPackageState,
    currentContactList,
    dispatch,
    currentUser,
    currentDomain,
    currentShopifyToken,
  } = useRedux();
  const [contactList, setContactList] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactListsPercentage, setContactListsPercentage] = useState();
  const [recipientsPercentage, setRecipientsPercentage] = useState();
  const [shopifyList, setShopifyList] = useState(false);
  const [limits, setLimits] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [listId, setListId] = useState();
  const recipientsPercentages = (recipients / limits.recipients) * 100;
  const contactListsPercentages =
    (currentContactList.contactLists?.length / limits.contact_lists) * 100;

  useEffect(() => {
    // Fetch contact lists only if the Redux store is empty and not fetched yet
    getContactLists();
  }, []);

  useEffect(() => {
    setContactListsPercentage(contactListsPercentage);
    setRecipientsPercentage(recipientsPercentages);
    setListUpdated(false);
  }, [contactList, listUpdated]);

  if (listUpdated === true) {
    setContactListsPercentage(contactListsPercentage);
    setRecipientsPercentage(recipientsPercentages);
    setListUpdated(false);
  }

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        setContactList(response.data.data);
        setLimits(response.data.limits);
        //set Shopify based limit for recipient
        setRecipients(response.data.recipients);
        setIsLoading(false);
        dispatch(
          setContactLists({
            contactLists: response.data.data,
            listChange: false,
          })
        );
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const canAddNewList = () => {
    if (contactList.length >= currentPackageState.list_limit) {
      return false;
    }
    return true;
  };

  const deleteList = (id) => {
    setListId(id);
    setShowDelete(true);
    //getContactLists();
  };

  const handleNewList = (contactList) => {
    setContactList(contactList);
  };

  return (
    <section className="min-h-screen w-full bg-[#0A0E1A] text-white font-inter">
  {/* Sticky Top Bar */}
  <div className="flex flex-row items-center h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-20 border-b border-[#1C2437]/40 px-8">
    <Search />
    <SmsPill />
  </div>

  {/* Main Content */}
  <div className="flex flex-col w-full lg:flex-row mt-6 ml-20 px-20">
    <div className="flex-1 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mx-20 relative">
        <span className="text-2xl font-semibold tracking-wide text-gray-100">Contact Lists</span>
        <button
          disabled={!canAddNewList()}
          onClick={handleModal}
          className={`px-3 py-2 text-white font-normal text-sm 2xl:text-lg rounded-lg transition-all ${
            canAddNewList()
              ? "bg-gradient-to-r from-[#3E6FF4] to-[#4937BA] shadow-md hover:opacity-90 hover:-translate-y-0.5 hover:scale-105"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create List
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)] mx-20">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 p-3 text-white/50 font-euclid text-sm 2xl:text-lg border-b border-gray-700">
          <div>Name</div>
          <div>Created at</div>
          <div>Recipients</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {!isLoading ? (
          currentContactList.contactLists?.map((conList, index) => {
            const isLast = index === currentContactList.contactLists?.length - 1;
            const isEven = index % 2 === 0;
            return (
              <div
                key={conList.id}
                className={`font-light bg-[#111827]`}
              >
                <motion.div
                  className={`grid grid-cols-4 gap-4 p-3 items-center text-white border-gray-700 ${
                    isLast ? "rounded-b-2xl" : "border-b border-gray-700"
                  }`}
                >
                  <div>{conList.list_name}</div>
                  <div>{conList.created_at}</div>
                  <div>{conList.contact_lenght ?? 0}</div>
                  <div className="flex gap-3 justify-center">
                    <Link
                      to={`/contact_list/${conList.id}`}
                      className="p-1 rounded-md hover:bg-[#3E6FF4]/20 transition-all hover:-translate-y-0.5 hover:scale-105"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 2xl:w-7 2xl:h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteList(conList.id)}
                      className="p-1 rounded-md hover:bg-red-600/20 transition-all hover:-translate-y-0.5 hover:scale-105"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="0.5"
                        stroke="currentColor"
                        className="w-5 h-5 2xl:w-7 2xl:h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })
        ) : (
          <LoaderSkeleton contact_list={true} div_size={3} />
        )}
      </div>
    </div>
  </div>

  {/* Modals */}
  <CreateListModal
    newList={handleNewList}
    redirect={false}
    showModal={show}
    onClose={() => setShow(false)}
  />
  <DeleteListModal
    contactListId={listId}
    showModal={showDelete}
    newList={handleNewList}
    setUpdated={() => setListUpdated(true)}
    onClose={() => setShowDelete(false)}
  />
</section>

  );
};

export default ContactList;
