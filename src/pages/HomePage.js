import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../css/EditMessage.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch, faFileImport } from "@fortawesome/free-solid-svg-icons";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBTypography,
} from "mdb-react-ui-kit";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  let { authTokens, logout } = useContext(AuthContext);

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
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    console.log(data);
    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === "Unauthorized") {
      logout();
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <div className="col-12">
              <MDBTypography variant="h1">Your messages</MDBTypography>
            </div>
            <div className="col-12">
              <h2>Col</h2>
            </div>
            <div className="col">
              <MDBListGroup>
                {displayedItems.map((note) => (
                  <MDBListGroupItem
                    key={note.id}
                    noBorders
                    color="dark"
                    id="listItem"
                    className="px-1 mb-4 rounded-3"
                  >
                    <div>
                      <div class="fw-bold">SMS</div>
                    </div>

                    <Link
                      type="button"
                      class="btn btn-primary"
                      // data-mdb-ripple-color="dark"
                      to={`/edit_message/${note.id}`}
                    >
                      <i class="fas fa-eye"></i>
                    </Link>

                    <Link
                      type="button"
                      class="btn btn-danger"
                      // data-mdb-ripple-color="dark"
                    >
                      <FontAwesomeIcon icon={faCouch} />
                    </Link>
                    <Link
                      type="button"
                      class="btn btn-outline-success"
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
                      class="btn btn-outline-secondary"
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
