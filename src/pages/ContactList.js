import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import { selectCurrentToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import CsvModal from "../features/modal/CsvModal";

const ContactList = () => {
  const axiosInstance = useAxiosInstance();
  let [contacts, setContacts] = useState([]);
  const [show, setShow] = useState(false);
  const token = useSelector(selectCurrentToken);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getContacts();
  }, []);

  let getContacts = async () => {
    try {
      let response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/contact_list/${params.id}/`,
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  let deleteContact = async (id) => {
    try {
      let response = await axiosInstance.delete(
        `http://localhost:8000/api/delete_recipient/${id}/`
      );
      if (response.status === 200) {
        console.log("deleted!");
      }
    } catch (error) {}
  };

  const handleModal = (e) => {
    setShow(true);
  };

  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12 mb-5">
              <h1 className="text-3xl font-bold mb-4">List of recepients</h1>
              <Link
                className="btn btn-dark"
                to={`/create_contact/${params.id}`}
              >
                Add contacts +
              </Link>
              <button className="btn btn-dark" onClick={handleModal}>
                upload contacts +
              </button>
            </div>
            <div className="col">
              <ul className="list-group list-group-light">
                {contacts.map((conList) => (
                  <div
                    style={{ marginLeft: "24%" }}
                    key={conList.id}
                    class="w-50 flex items-center space-x-4 rounded-md border-solid border-1 bg-gray-100 mb-2"
                  >
                    <div class="flex-shrink-0" style={{ marginLeft: "10px" }}>
                      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {conList.first_name}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {conList.email}
                      </p>
                      <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                        {conList.phone_number}
                      </p>
                    </div>
                    <div class="flex-1 min-w-0"></div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-white">
                      <button
                        type="button"
                        onClick={() => deleteContact(conList.id)}
                        style={{ marginRight: "10px" }}
                        // data-mdb-ripple-color="dark"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 fill-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <CsvModal showModal={show} onClose={() => setShow(false)}></CsvModal>
        </div>
      </div>
    </section>
  );
};

export default ContactList;
