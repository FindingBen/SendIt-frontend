import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
      <div className="flex flex-col xs:mx-3">
        <div className="flex justify-between items-center mb-4 h-20">
          <h3 class="xl:text-2xl lg:text-xl text-left font-semibold text-white mx-20">
            User page
          </h3>
          <div class="flex flex-row items-center mx-20">
            <SmsPill />
          </div>
        </div>

        <div className="flex md:flex-row xs:flex-col md:gap-2 mt-2 xs:items-center items-start xs:mx-5">
          <div className="ml-16">
            <UserAccount />
          </div>
          <div className="flex flex-col gap-2">
            <PackageInformation package={currentPackageState} />
            <div className="flex md:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />

              <div className="flex flex-col rounded-2xl p-4 xs:mt-2 md:mt-0 bg-gradient-to-b from-lighterMainBlue to-mainBlue border-gray-800 border-2 xs:w-[330px] lg:w-[370px] 2xl:w-[450px] lg:h-[240px] 2xl:h-[270px]">
                <h3 class="flex flex-row xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-semibold text-white relative">
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
