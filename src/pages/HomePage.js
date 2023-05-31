import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../css/EditMessage.css";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCouch,
  faFileImport,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBTypography,
} from "mdb-react-ui-kit";
import "../css/Home.css";
import {
  selectCurrentUser,
  selectCurrentToken,
  logOut,
} from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const handleLogout = () => dispatch(logOut(user, token));
  // let { authTokens, logout } = useContext(AuthContext);
  const params = useParams();
  useEffect(() => {
    getNotes();
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = notes.slice(startIndex, endIndex);
  let getNotes = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(token),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === "Unauthorized") {
      dispatch(logOut(user, token));
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <MDBTypography variant="h1">Your messages</MDBTypography>
            </div>
          </div>
          <div className="row border border-dark">
            {/* <div class="col-sm border border-dark">One of three columns</div>
            <div class="col-sm border border-dark">One of three columns</div>
            <div class="col-sm border border-dark">One of three columns</div> */}
            <h2>Statistics and analysis TBD</h2>
          </div>
          <div className="row">
            <hr></hr>
            <div className="col">
              <MDBListGroup id="ulItem">
                {displayedItems.map((note) => (
                  <MDBListGroupItem
                    key={note.id}
                    noBorders
                    color="dark"
                    id="listItem"
                    className="px-1 mb-4 rounded-3"
                  >
                    <div>
                      <div className="fw-bold">SMS</div>
                    </div>

                    <Link
                      type="button"
                      className="btn btn-primary"
                      // data-mdb-ripple-color="dark"
                      to={`/edit_message/${note.id}`}
                    >
                      <i className="fas fa-eye"></i>
                    </Link>

                    <Link
                      type="button"
                      className="btn btn-danger"
                      to={`/delete_message/${note.id}`}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                    <Link
                      type="button"
                      className="btn btn-outline-success"
                      // data-mdb-ripple-color="dark"
                    >
                      <FontAwesomeIcon icon={faFileImport} />
                    </Link>
                  </MDBListGroupItem>
                ))}
                <hr></hr>
              </MDBListGroup>
              {totalPages > 1 && (
                <div>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-mdb-ripple-color="dark"
                      key={page}
                      id="paginationBtn"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <br></br>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
