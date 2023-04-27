import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const CreateNote = () => {
  let { authTokens, user } = useContext(AuthContext);
  let createNotes = async (e) => {
    e.preventDefault();
    let response = await fetch("http://127.0.0.1:8000/api/create_notes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({ body: e.target.body.value, users: user.user_id }),
    });
    if (response.status === 200) {
      console.log("Congratz");
    }
  };

  return (
    <div>
      <form onSubmit={createNotes}>
        <input type="text" name="body" placeholder="Name your note" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default CreateNote;
