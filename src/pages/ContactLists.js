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
        <div class="flex-1 sm:px-0">
          <div className="flex justify-between items-center mb-4 h-20 bg-navBlue border-gray-800 border-b-2">
            <h3 class="xl:text-3xl lg:text-2xl text-xl font-light text-left text-white mx-20">
              Contact lists
            </h3>

            <div class="flex flex-row items-center mx-20">
              <SmsPill />
            </div>
          </div>

          <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-20">
            <div class="group bg-black py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-2xl hover:bg-gray-900/40">
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

            {currentContactList.contactLists?.map((conList) => {
              return (
                <div className={`flex flex-row space-x-2 items-center`}>
                  <motion.div
                    initial={
                      initialLoad
                        ? { opacity: 0, scale: 0.5 }
                        : { opacity: 1, scale: 1 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={
                      initialLoad
                        ? {
                            duration: 0.4,
                            delay: 0.2,
                            ease: [0, 0.41, 0.1, 1.01],
                          }
                        : {}
                    }
                    key={conList.id}
                    class="relative w-100 bg-black/50 h-72 flex flex-col space-y-2 items-center rounded-2xl"
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
                    <Link to={`/contact_list/${conList.id}`}>
                      <div className="p-4 flex flex-col items-center justify-between bg-darkBlue w-40 h-60 rounded-2xl mx-3 my-3 shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-10 h-10 text-white hover:bg-slate-400 cursor-pointer rounded-xl"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>

                        <h4 class="text-grayWhite text-2xl font-light capitalize text-center">
                          {conList.list_name}
                        </h4>
                        <p class="text-white/50">
                          Recipients: {conList.contact_lenght ?? 0}
                        </p>
                      </div>
                    </Link>
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
