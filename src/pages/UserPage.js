import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import UserAccount from "../components/AccountSettings/UserAccount";
import SmsPill from "../components/SmsPill/SmsPill";
import PasswordChange from "../utils/PasswordChange";
import { useRedux } from "../constants/reduxImports";
import PackageInformation from "../components/AccountSettings/PackageInformation";
import CloseAccountModal from "../features/modal/CloseAccountModal";
import Search from "../components/SearchComponent/Search";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentPackageState } = useRedux();
  const [username, setUsername] = useState();
  const [packagePlans, setPackage] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();
  const [purchases, setPurchases] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const [searchValue, setSearchValue] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("account");
  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   //getUser();
  //   purchase_history();
  // }, [msg]);

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3000);
    setTimeout(() => setMsg(), 3000);
  }, [errorMsg, msg]);

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
    <section className="min-h-screen max-w-screen items-center justify-center">
      <div className="flex flex-col">
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-16 bg-navBlue sticky top-0 z-10">
          <Search />

          <SmsPill />
        </div>

        <div className="flex flex-col gap-2 mx-44">
          <UserAccount />
          <div className="flex flex-col gap-2">
            <PackageInformation package={currentPackageState} />
            <div className="flex md:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />
            </div>
            <div className="flex flex-col rounded-2xl p-4 mx-20">
              <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-normal text-white relative border-b-2 border-gray-800">
                Account Deletion
                <div
                  onClick={(e) => setShowModal(e)}
                  className="px-1 py-1 bg-red-700 text-white xs:text-sm 2xl:text-lg border-gray-800 rounded-md absolute -right-2 -top-2 hover:bg-red-500 cursor-pointer"
                >
                  Close Account
                </div>
              </h3>
              <p className="text-white/60 xs:text-sm lg:text-normal text-start">
                If you wish to close your account press the button and we will
                do the rest.{" "}
              </p>
            </div>
          </div>
        </div>

        <CloseAccountModal
          showModal={showModal}
          onClose={(e) => setShowModal(false)}
        />
      </div>
    </section>
  );
};

export default UserPage;
