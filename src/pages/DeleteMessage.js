import React, { useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { useSelector } from "react-redux";
const DeleteMessage = () => {
  const token = useSelector(selectCurrentToken);
  // let { authTokens } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  let deleteMessage = async (e) => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/delete_message/${params.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(token),
        },
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      navigate("/home");
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
