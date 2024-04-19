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
  const [listUpdated, setListUpdated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  let max_list_allowed = 3;
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [listId, setListId] = useState();

  useEffect(() => {
    // Fetch contact lists only if the Redux store is empty
    if (!currentContactList.length) {
      getContactLists();
      setInitialLoad(true);
    }
  }, []);

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        setContactList(response.data);
        dispatch(
          setContactLists({ contactLists: response.data, listChange: false })
        );
        setListId();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const canAddNewList = () => {
    if (
      currentPackageState === "Basic package" &&
      contactList.length >= max_list_allowed
    ) {
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

          <div className="flex flex-row">
            <div className=" bg-mainBlue w-[60%] border-gray-800 shadow-md border-2 rounded-2xl mt-4 mx-20">
              <div class="grid grid-cols-5 gap-4 text-white/50 font-normal text-sm border-b-2 p-2 border-gray-800">
                <div className="">NAME</div>
                <div>CREATED AT</div>
                <div>RECIPIENTS</div>

                <div>ACTION</div>
              </div>
              {currentContactList.contactLists?.map((conList, index) => {
                const isLastItem =
                  index === currentContactList.contactLists.length - 1;
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
                      className={`grid grid-cols-5 gap-4 p-2 text-white border-gray-800 ${
                        isLastItem ? "rounded-b-2xl" : "border-b-2"
                      }`}
                      key={conList.id}
                    >
                      <div>{conList.list_name}</div>
                      <div>{conList.created_at}</div>
                      <div>{conList.contact_lenght}</div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
            <div className="bg-mainBlue w-[30%] p-4 border-gray-800 border-2 rounded-2xl mt-4 mr-20">
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
                  <div class="w-[60%] bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div class="bg-purple-600 w-[45%] h-3 rounded-full dark:bg-purple-500"></div>
                  </div>
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
          setUpdated={() => setListUpdated(true)}
          onClose={() => setShowDelete(false)}
        ></DeleteListModal>
      </div>
    </div>
  );
};

export default ContactList;
