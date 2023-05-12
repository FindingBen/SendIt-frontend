import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  let { authTokens, logout } = useContext(AuthContext);
  let BASE_URL = "http://127.0.0.1:8000";
  useEffect(() => {
    getNotes();
  }, []);

  let getNotes = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

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
              <h2>Your messages</h2>
            </div>
            <div className="col">
              <ul class="list-group list-group-light">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div class="fw-bold">{note.body}</div>
                      <img
                        height="150px"
                        src={`${BASE_URL + note.image}`}
                        alt="Italian Trulli"
                      ></img>
                      {/* <div class="text-muted">john.doe@gmail.com</div> */}
                    </div>
                    {/* <span class="badge rounded-pill badge-success">Active</span> */}
                    <a href="">Edit</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
