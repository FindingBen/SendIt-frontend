import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";

const DeleteMessage = () => {
  const axiosInstance = useAxiosInstance()

  const params = useParams();
  const navigate = useNavigate();
  let deleteMessage = async (e) => {
    e.preventDefault();
    try {
      let response = await axiosInstance.delete(
        `http://127.0.0.1:8000/api/delete_message/${params.id}`
      );
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Error deleting message:", error);
    }
  };
  
  return (
    <section className="vh-100  w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <h3>Are you sure you want to delete this message?</h3>
              <button
                type="button"
                class="btn btn-outline-success btn-rounded"
                data-mdb-ripple-color="dark"
                onClick={deleteMessage}
              >
                Yes
              </button>
              <Link
                type="button"
                class="btn btn-outline-danger btn-rounded"
                data-mdb-ripple-color="dark"
                to={"/home"}
              >
                No
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteMessage;
