import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import Billings from "../components/AccountSettings/Billings";
import UserAccount from "../components/AccountSettings/UserAccount";
import SmsPill from "../components/SmsPill/SmsPill";
import PasswordChange from "../utils/PasswordChange";
import { useRedux } from "../constants/reduxImports";
import AccountClose from "../components/AccountSettings/AccountClose";
import PackageInformation from "../components/AccountSettings/PackageInformation";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser } = useRedux();
  const [username, setUsername] = useState();
  const [packagePlans, setPackage] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const [selectedComponent, setSelectedComponent] = useState("account");
  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //getUser();
    purchase_history();
  }, [msg]);

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3000);
    setTimeout(() => setMsg(), 3000);
  }, [errorMsg, msg]);

  let getUser = async () => {
    try {
      let response = await axiosInstance.get(`/api/user_account/${params.id}/`);

      if (response.status === 200) {
        setUser(response.data);
      } else {
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  let purchase_history = async (e) => {
    try {
      let response = await axiosInstance.get(`stripe/purchases/${params.id}`);
      if (response.status === 200) {
        setPurchases(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="min-h-screen w-100 items-center justify-center relative">
      <div className="flex-1 flex flex-col xs:mx-3 lg:mx-20">
        <div className="flex justify-between items-center mb-4 h-20">
          <h3 class="xl:text-2xl lg:text-2xl  text-lg text-left font-semibold text-white">
            User page
          </h3>
          <div class="flex flex-row items-center">
            <SmsPill />
          </div>
        </div>

        <div className="flex lg:flex-row xs:flex-col lg:gap-2 mt-2 xs:items-center items-start xs:mx-5">
          <div>
            <UserAccount />
          </div>
          <div className="flex flex-col gap-2">
            <PackageInformation />
            <div className="flex lg:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />

              <AccountClose />
            </div>
          </div>
        </div>

        {/* <div className="flex xl:flex-row xs:flex-col lg:gap-2 mt-2 xs:items-center items-start">
          <UserAccount />
          <PasswordChange user_obj={user} />
          <AccountClose />
        </div> */}
      </div>
    </section>
  );
};

export default UserPage;
