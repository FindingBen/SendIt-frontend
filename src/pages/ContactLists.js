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
        setListId();
        const recipientsPercentages =
          (response.data.recipients / response.data.limits.recipients) * 100;
        const contactListsPercentage =
          (response.data.data.length / response.data.limits.contact_lists) *
          100;

        setContactListsPercentage(contactListsPercentage);
        setRecipientsPercentage(recipientsPercentages);
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
    <div class="min-h-screen max-w-screen items-center justify-center">
      <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
        <Link to={"/welcome"}>
          <img
            src={require("../assets/noBgLogo.png")}
            width={65}
            alt="logo"
            className="mt-2"
          />
        </Link>
        <h3 className="2xl:text-3xl lg:text-2xl text-lg font-euclid font-normal text-left text-white mx-5">
          Sendperplane
        </h3>

        <div class="relative">
          {searchValue === "" && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
          )}
          <input
            type="search"
            id="default-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="block w-full p-2 ps-10 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
            required
          />
        </div>

        <SmsPill />
      </div>
      <div className="mx-20">
        <div className="flex flex-row relative mx-44">
          <span className="text-xl text-white font-euclid">Contact lists</span>
          <div className="flex flex-row absolute right-0">
            <button
              disabled={!canAddNewList()}
              onClick={handleModal}
              className={`px-2 py-1 2xl:px-3 2xl:py-2 mr-5 text-white font-normal text-sm 2xl:text-lg cursor-pointer ${
                canAddNewList() ? "bg-ngrokBlue" : "bg-gray-500"
              } rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105`}
            >
              Create list
            </button>
          </div>
        </div>
        <div className=" bg-mainBlue border-gray-800 shadow-md border-2 rounded-2xl mt-4 mx-44">
          <div class="grid grid-cols-4 gap-4 text-white/50 font-euclid text-sm 2xl:text-lg border-b-2 p-2 border-gray-800">
            <div className="">Name</div>
            <div>Created at</div>
            <div>Recipients</div>

            <div>Action</div>
          </div>
          {!isLoading ? (
            <>
              {currentContactList.contactLists?.map((conList, index) => {
                const isLastItem =
                  index === currentContactList.contactLists?.length - 1;
                const evenRow = index % 2 === 0;
                return (
                  <div
                    className={`font-light ${
                      evenRow
                        ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue"
                        : "bg-mainBlue rounded-2xl"
                    }`}
                    key={conList.id}
                  >
                    <motion.div
                      className={`grid grid-cols-4 font-euclid gap-4 p-2 text-white border-gray-800 ${
                        isLastItem ? "rounded-b-2xl" : "border-b-2"
                      }`}
                      key={conList.id}
                    >
                      <div>{conList.list_name}</div>
                      <div>{conList.created_at}</div>
                      {!currentShopifyToken ? (
                        <div>{conList.contact_lenght}</div>
                      ) : (
                        <div>{recipients}</div>
                      )}
                      <div className="flex flex-row mx-16 gap-3">
                        <div className="rounded-md mx-auto my-auto p-0.5 hover:bg-ngrokBlue cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
                          <Link
                            type="button"
                            to={`/contact_list/${conList.id}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.0"
                              stroke="currentColor"
                              class="w-5 h-5 2xl:w-7 2xl:h-7"
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
                          </Link>
                        </div>
                        <div className="rounded-md mx-auto my-auto p-0.5 hover:bg-ngrokBlue hover:fill-red-700 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
                          <button
                            type="button"
                            onClick={() => deleteList(conList.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="0.5"
                              stroke="currentColor"
                              class="h-5 w-5 2xl:h-7 2xl:w-7"
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
                    </motion.div>
                  </div>
                );
              })}
            </>
          ) : (
            <LoaderSkeleton contact_list={true} div_size={3} />
          )}
        </div>
      </div>

      <CreateListModal
        newList={handleNewList}
        showModal={show}
        onClose={() => setShow(false)}
      ></CreateListModal>
      <DeleteListModal
        contactListId={listId}
        showModal={showDelete}
        newList={handleNewList}
        setUpdated={() => setListUpdated(true)}
        onClose={() => setShowDelete(false)}
      ></DeleteListModal>
    </div>
  );
};

export default ContactList;
