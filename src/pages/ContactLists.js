import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import "../css/ContactList.css";
import useAxiosInstance from "../utils/axiosInstance";
import CreateListModal from "../features/modal/CreateListModal";
import DeleteListModal from "../features/modal/DeleteListModal";
import { motion } from "framer-motion";
import { useRedux } from "../constants/reduxImports";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const { currentPackageState } = useRedux();
  const [contactList, setContactList] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  let max_list_allowed = 3;
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [listId, setListId] = useState();

  useEffect(() => {
    getContactLists();
  }, [listUpdated]);

  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/");
      if (response.status === 200) {
        setContactList(response.data);
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
  };

  const handleNewList = (contactList) => {
    setContactList(contactList);
  };

  return (
    <div class="min-h-screen flex-d w-100 items-center justify-center">
      <div class="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div class="flex-1 px-2 sm:px-0">
          <div class="flex justify-between items-center">
            <h3 class="xl:text-3xl text-2xl font-extralight text-white">
              Contact lists
            </h3>
          </div>

          <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div class="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40">
              {canAddNewList() ? (
                <button
                  class="bg-gray-900/70 text-white/50 group-hover:text-white group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
                  onClick={handleModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              ) : (
                <p class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center transition duration-200">
                  Maximum lists reached
                </p>
              )}
            </div>

            {contactList?.map((conList) => {
              return (
                <div className={`flex flex-row space-x-2 items-center`}>
                  <motion.div
                    initial={
                      initialLoad
                        ? { opacity: 0, scale: 0.5 }
                        : { opacity: 1, scale: 1 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.2,
                      ease: [0, 0.41, 0.1, 1.01],
                    }}
                    key={conList.id}
                    class="relative w-100 bg-darkestGray h-72 flex flex-col space-y-2 items-center rounded-md"
                  >
                    <button
                      className="absolute right-2 top-2"
                      onClick={() => deleteList(conList.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 text-red-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <div className="p-4 flex flex-col items-center justify-between bg-darkBlue w-40 h-60 rounded-md mx-3 my-3 shadow-lg">
                      <Link to={`/contact_list/${conList.id}`}>
                        <img
                          class="w-20 h-20 object-cover object-center rounded-full"
                          src={require("../assets/contacts.png")}
                          alt="art"
                        />
                      </Link>
                      <h4 class="text-grayWhite text-2xl font-light capitalize text-center">
                        {conList.list_name}
                      </h4>
                      <p class="text-white/50">
                        Recipients: {conList.contact_lenght ?? 0}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
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
