import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import UserAccount from "../components/AccountSettings/UserAccount";
import SmsPill from "../components/SmsPill/SmsPill";
import PasswordChange from "../utils/PasswordChange";
import { useRedux } from "../constants/reduxImports";
import PackageInformation from "../components/AccountSettings/PackageInformation";
import CloseAccountModal from "../features/modal/CloseAccountModal";

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
        <div className="flex flex-row items-center border-b-2 border-gray-800 mb-4 h-18 bg-navBlue sticky top-0 z-10">
          <Link to={"/welcome"}>
            <img
              src={require("../assets/noBgLogo.png")}
              width={65}
              alt="logo"
              className="mt-2"
            />
          </Link>
          <h3 className="2xl:text-3xl lg:text-2xl text-lg font-euclid font-normal text-left text-white mx-5">
            Sendperplane
          </h3>

          <div class="relative">
            {searchValue === "" && (
              <div className="absolute inset-y-0 start-0 flex items-center ps-1 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            )}
            <input
              type="search"
              id="default-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-100 border-2 border-gray-700 rounded-lg bg-ngrokGray"
              required
            />
          </div>

          <SmsPill />
        </div>

        <div className="flex md:flex-row xs:flex-col md:gap-2 mt-2 xs:items-center items-start xs:mx-5 lg:mx-44">
          <UserAccount />
          <div className="flex flex-col gap-2">
            <PackageInformation package={currentPackageState} />
            <div className="flex md:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />
            </div>
            <div className="flex flex-col rounded-2xl p-4 xs:mt-2 md:mt-0 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 xs:w-[330px] lg:w-[370px] 2xl:w-[450px] lg:h-[240px] 2xl:h-[270px]">
              <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-normal text-white relative">
                Account Deletion
                <div
                  onClick={(e) => setShowModal(e)}
                  className="px-2 py-2 bg-red-700 text-white xs:text-xs lg:text-normal border-gray-800 rounded-md absolute right-0 top-0 hover:bg-red-500 cursor-pointer"
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
