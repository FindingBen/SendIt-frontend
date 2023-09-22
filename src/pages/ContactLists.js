import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import "../css/ContactList.css";
import { selectCurrentToken } from "../features/auth/authSlice";
import useAxiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import CreateListModal from "../features/modal/CreateListModal";
import DeleteListModal from "../features/modal/DeleteListModal";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const [contactList, setContactList] = useState([]);
  const [listUpdated, setListUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [listId, setListId] = useState();
  useEffect(() => {
    getContactLists();
    setIsLoading(true);
  }, []);
  console.log(listId);
  let getContactLists = async () => {
    try {
      let response = await axiosInstance.get("/api/contact_lists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      });
      if (response.status === 200) {
        setContactList(response.data);
        setIsLoading(false);
        setListId();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const deleteList = (id) => {
    setListId(id);
    setShowDelete(true);
  };

  return (
    <div class="min-h-screen flex-d w-100 items-center justify-center">
      <div class="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div class="flex-1 px-2 sm:px-0">
          <div class="flex justify-between items-center">
            <h3 class="text-3xl font-extralight text-white/50">
              Contact lists
            </h3>
            {/* <div class="inline-flex items-center space-x-2">
              <a
                class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </a>
              <a
                class="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </a>
            </div> */}
          </div>

          <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div class="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40 hover:smooth-hover">
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
              <p class="text-white/50 group-hover:text-white group-hover:smooth-hover text-center">
                Create list
              </p>
            </div>

            {contactList?.map((conList) => {
              return (
                <div className="inline-flex space-x-2 items-center">
                  <div
                    key={conList.id}
                    class="relative w-100 group bg-gray-900 py-3 sm:py-20 px-4 flex flex-col space-y-2 items-center rounded-md hover:bg-gray-900/80 hover:smooth-hover"
                  >
                    <div className="mb-8 ml-48">
                      <button onClick={() => deleteList(conList.id)}>
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
                    </div>
                    <Link to={`/contact_list/${conList.id}`}>
                      <img
                        class="w-20 h-20 object-cover object-center rounded-full"
                        src={require("../assets/contacts.png")}
                        alt="art"
                      />
                    </Link>
                    <h4 class="text-white text-2xl font-bold capitalize text-center">
                      {conList.list_name}
                    </h4>
                    <p class="text-white/50">
                      Recipients: {conList.contact_lenght}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <CreateListModal
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
