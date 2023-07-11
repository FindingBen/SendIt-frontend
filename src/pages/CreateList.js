import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const CreateList = () => {
  const axiosInstance = useAxiosInstance();
  const [listName, setListName] = useState();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const handleList = (e) => {
    setListName(e.target.value);
  };
  console.log(listName);
  let createList = async (e) => {
    e.preventDefault();
    const formData = {
      list_name: listName,
      users: user,
    };
    try {
      let response = await axiosInstance.post(
        `http://localhost:8000/api/create_list/${user}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
        }
      );
      if (response.status === 200 || 201) {
        navigate("/contact_lists");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="vh-100 w-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="row">
            <h2>Name the list</h2>
            <input
              type="text"
              name="list_name"
              value={listName}
              //onChange={handleList}
            ></input>
            <button onClick={createList}>Create</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateList;
