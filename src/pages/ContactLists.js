import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import "../css/ContactList.css";
import useAxiosInstance from "../utils/axiosInstance";
import CreateListModal from "../features/modal/CreateListModal";
import DeleteListModal from "../features/modal/DeleteListModal";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";
import { setContactLists } from "../redux/reducers/contactListReducer";
import SmsPill from "../components/SmsPill/SmsPill";
const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const { currentPackageState, currentContactList, dispatch } = useRedux();
  const [contactList, setContactList] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [contactListsPercentage, setContactListsPercentage] = useState();
  const [recipientsPercentage, setRecipientsPercentage] = useState();
  const [limits, setLimits] = useState({});
  let basic_max_list_allowed = 5;
  let silver_max_list_allowed = 10;
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [listId, setListId] = useState();
  const recipientsPercentages = (recipients.length / limits.recipients) * 100;
  const contactListsPercentages =
    (contactList.length / limits.contact_lists) * 100;
  useEffect(() => {
    // Fetch contact lists only if the Redux store is empty
    getContactLists();
  }, []);

  useEffect(() => {
    setContactListsPercentage(contactListsPercentage);
    setRecipientsPercentage(recipientsPercentages);
    setListUpdated(false);
  }, [contactList, listUpdated]);
  console.log(recipientsPercentages);

  if (listUpdated === true) {
    setContactListsPercentage(recipientsPercentages);
    setRecipientsPercentage(recipientsPercentages);
    setListUpdated(false);
  }
  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        setContactList(response.data.data);
        setLimits(response.data.limits);
        setRecipients(response.data.recipients);

        dispatch(
          setContactLists({
            contactLists: response.data.data,
            listChange: false,
          })
        );
        setListId();
        const recipientsPercentages =
          (response.data.recipients.length / response.data.limits.recipients) *
          100;
        const contactListsPercentage =
          (response.data.data.length / response.data.limits.contact_lists) *
          100;

        setContactListsPercentage(contactListsPercentage);
        setRecipientsPercentage(recipientsPercentages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const canAddNewList = () => {
    if (contactList.length >= basic_max_list_allowed) {
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

  const widthVariants = {
    width: recipientsPercentage,
  };
  console.log(contactListsPercentages);
  return (
    <div class="min-h-screen w-[100%] items-center justify-center">
      <div class="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row">
        <div class="flex-1">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <h3 class="xl:text-3xl lg:text-2xl text-xl font-semibold text-left text-white mx-20">
              Contact lists
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>

          <div className="flex flex-row h-[100%]">
            <div className=" bg-mainBlue w-[60%] h-[80%] border-gray-800 shadow-md border-2 rounded-2xl mt-4 mx-20">
              <div className="flex flex-row relative border-b border-gray-800">
                <p className="text-white font-semibold text-xl xl:text-2xl flex items-start my-3 mt-3 ml-5">
                  Your contact lists
                </p>
                <button
                  disabled={!canAddNewList()}
                  onClick={handleModal}
                  className={`px-2 py-1 mr-5 text-white font-normal text-sm cursor-pointer ${
                    canAddNewList() ? "bg-purpleHaze" : "bg-gray-500"
                  } rounded-lg transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105 absolute right-0 top-4`}
                >
                  Create list
                </button>
              </div>
              <div class="grid grid-cols-4 gap-4 text-white/50 font-normal text-sm border-b-2 p-2 border-gray-800">
                <div className="">NAME</div>
                <div>CREATED AT</div>
                <div>RECIPIENTS</div>

                <div>ACTION</div>
              </div>
              {currentContactList.contactLists?.map((conList, index) => {
                const isLastItem =
                  index === currentContactList.contactLists?.length - 1;
                const evenRow = index % 2 === 0;
                return (
                  <div
                    className={` font-light ${
                      evenRow
                        ? "bg-gradient-to-b from-lighterMainBlue to-mainBlue"
                        : "bg-mainBlue"
                    }`}
                  >
                    <motion.div
                      className={`grid grid-cols-4 gap-4 p-2 text-white border-gray-800 ${
                        isLastItem ? "rounded-b-2xl" : "border-b-2"
                      }`}
                      key={conList.id}
                    >
                      <div>{conList.list_name}</div>
                      <div>{conList.created_at}</div>
                      <div>{conList.contact_lenght}</div>
                      <div className="flex flex-row mx-16 gap-3">
                        <div className=" border-gray-800 rounded-md border-2 mx-auto my-auto p-0.5  hover:bg-purpleHaze cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
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
                              class="w-5 h-5 fill-gray-700"
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
                        <div className=" border-gray-800 rounded-md border-2 mx-auto my-auto p-0.5 hover:bg-purpleHaze hover:fill-red-700 cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105">
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
                              class="h-5 w-5"
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
            </div>
            <div className="bg-mainBlue w-[30%] h-[75%] p-4 border-gray-800 border-2 rounded-2xl mt-4 mr-20">
              <p className="text-white text-justify text-xl font-semibold mb-3">
                Package limitation
              </p>
              <p className="text-start text-white/50">
                Because of your current package you have the following limit
                down below:
              </p>
              <div className="flex flex-col mt-5">
                <div className="flex flex-row">
                  <p className="text-start text-white">Contact Lists</p>
                  <div class="w-[50%] relative bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2 ml-3">
                    <div
                      className={`bg-purple-600 h-3 rounded-full dark:bg-purple-500`}
                      style={{ width: contactListsPercentages + "%" }}
                    ></div>
                    <p
                      className={`absolute inset-0 bg-purple-600 blur`}
                      style={{ width: contactListsPercentages + "%" }}
                    ></p>
                  </div>
                  <div className="flex flex-row mx-auto p-1 bg-mainBlue border-2 border-gray-800 rounded-lg">
                    <p className="text-white">
                      {contactList?.length}/{limits?.contact_lists}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row mt-4">
                  <p className="text-start text-white">Recipients</p>
                  <div class="w-[50%] bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2 ml-3 relative">
                    <div
                      className={`bg-purple-600 h-3 rounded-full dark:bg-purple-500`}
                      style={{ width: recipientsPercentages + "%" }}
                    ></div>
                    <p
                      className={`absolute inset-0 bg-purple-600 blur`}
                      style={{ width: recipientsPercentages + "%" }}
                    ></p>
                  </div>
                  <div className="flex flex-row mx-auto p-1 bg-mainBlue border-2 border-gray-800 rounded-lg">
                    <p className="text-white">
                      {recipients?.length}/{limits?.recipients}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-start mt-3">
                  <Link
                    to={"/plans"}
                    className="py-1 px-2 bg-purpleHaze rounded-lg text-white cursor-pointer transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-105"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default ContactList;
