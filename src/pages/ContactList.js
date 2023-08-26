import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CsvModal from "../features/modal/CsvModal";
import AddContactModal from "../features/modal/AddContactModal";
import ReactPaginate from "react-paginate";
import "../css/ContactList.css";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  const [contacts, setContacts] = useState([]);
  const [showCsv, setShowCsv] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const token = useSelector(selectCurrentToken);
  const params = useParams();
  const navigate = useNavigate();
  const rowsPerPage = 8;

  useEffect(() => {
    getContacts();
    setIsLoading(true);
  }, []);
  console.log(contacts);
  console.log("TEST");
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = contacts.slice(startIndex, endIndex);

  console.log(currentPage);
  let getContacts = async () => {
    try {
      let response = await axiosInstance.get(
        `/api/contact_list/${params.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );

      if (response.status === 200) {
        setContacts(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let deleteContact = async (id) => {
    setIsDelete(true);
    try {
      let response = await axiosInstance.delete(`/api/delete_recipient/${id}/`);
      if (response.status === 200) {
        setContacts(contacts.filter((contact) => contact.id !== id));
        console.log("deleted!");
        setIsDelete(false);
      }
    } catch (error) {}
  };

  const handleCsvModal = (e) => {
    setShowCsv(true);
  };

  const handleModal = (e) => {
    setShow(true);
  };

  const handleNewContact = (contact) => {
    setContacts(contact);
  };
  console.log(paginatedData);

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row" style={{ paddingLeft: "2.5%" }}>
            <div
              className="border-solid border-1 border-gray-600 mt-3 mb-3 rounded h-20"
              style={{ backgroundColor: "#3d3e40", width: "95%" }}
            >
              <div className="row">
                <div className="col">
                  <h1 className="text-3xl mb-2 mt-3 text-gray-300 text-left">
                    List of recepients
                  </h1>
                </div>
                <div className="col">
                  <button className="btn btn-dark mt-3" onClick={handleModal}>
                    Add contacts +
                  </button>

                  <button
                    className="btn btn-dark mt-3"
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
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="col">
                  <h1 className="text-2xl mb-2 mt-3 text-gray-200 text-right">
                    Sms credit count: {}
                  </h1>
                </div>
              </div>
            </div>

            <div
              class="overflow-hidden rounded-lg border-1 border-gray-600 mt-3 mb-3"
              style={{ width: "95%" }}
            >
              <table
                class="w-full bg-white text-left text-sm text-gray-200"
                style={{
                  marginLeft: "-1.4%",
                  width: "102.7%",
                  paddingLeft: "10%",
                }}
              >
                <thead class="bg-gray-50 text-gray-200">
                  <tr>
                    <th scope="col" class="px-6 py-4 font-medium text-gray-200">
                      First name
                    </th>
                    <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                      Last Name
                    </th>
                    <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                      Phone Number
                    </th>
                    <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                      Email
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-medium text-gray-900"
                    ></th>
                  </tr>
                </thead>
                {!isLoading ? (
                  <tbody class="divide-y divide-gray-500 border-t border-gray-500">
                    {paginatedData.map((rowData) => (
                      <tr class="hover:bg-gray-50" key={rowData.id}>
                        <th class="gap-3 px-6 py-4 font-normal text-gray-900">
                          <div class="text-sm">
                            <div class="font-medium text-gray-200">
                              {rowData.first_name}
                            </div>
                            {/* <div class="text-gray-400">jobs@sailboatui.com</div> */}
                          </div>
                        </th>
                        <td class="text-sm">
                          <div class="font-medium text-gray-200">
                            {rowData.last_name}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="font-medium text-gray-200">
                            {rowData.phone_number}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="gap-2">
                            <div class="font-medium text-gray-200">
                              {rowData.email}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex justify-end gap-4 text-red-400">
                            {!isDelete ? (
                              <button
                                type="button"
                                onClick={() => deleteContact(rowData.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="h-6 w-6"
                                  x-tooltip="tooltip"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <div role="status">
                                <svg
                                  aria-hidden="true"
                                  class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                  </tbody>
                )}
              </table>
            </div>
            <ReactPaginate
              pageCount={Math.ceil(contacts.length / rowsPerPage)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
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
        </div>
      </div>
    </section>
  );
};

export default ContactList;
