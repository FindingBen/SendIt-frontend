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
  }, [listUpdated]);

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

  const handleNewList = (contactList) => {
    setContactList(contactList);
  };

  return (
    <div class="min-h-screen flex-d w-100 items-center justify-center">
      <div class="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div class="flex-1 px-2 sm:px-0">
          <div class="flex justify-between items-center">
            <h3 class="xl:text-3xl text-2xl font-extralight text-white/50">
              Contact lists
            </h3>
          </div>

          <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div class="group bg-gray-900/30 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/40">
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
                <div
                  className={`inline-flex space-x-2 items-center transition-opacity ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }>`}
                >
                  {!isLoading ? (
                    <div
                      key={conList.id}
                      class="relative w-100 group bg-gray-900 py-3 sm:py-20 px-4 flex flex-col space-y-2 items-center rounded-md transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-110 hover:bg-gray-900/80 duration-200"
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
                      <h4 class="text-grayWhite text-2xl font-light capitalize text-center">
                        {conList.list_name}
                      </h4>
                      <p class="text-white/50">
                        Recipients: {conList.contact_lenght}
                      </p>
                    </div>
                  ) : (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  )}
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
