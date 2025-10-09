import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import UserAccount from "../components/AccountSettings/UserAccount";
import SmsPill from "../components/SmsPill/SmsPill";
import PasswordChange from "../utils/PasswordChange";
import { useRedux } from "../constants/reduxImports";
import PackageInformation from "../components/AccountSettings/PackageInformation";
import CloseAccountModal from "../features/modal/CloseAccountModal";
import CancelSubscription from "../features/modal/CancelSubscription";
import Search from "../components/SearchComponent/Search";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUser, currentPackageState, currentShopifyToken } = useRedux();
  const [username, setUsername] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [success, setSuccess] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();

  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });

  useEffect(() => {
    getUser();
  }, [msg]);

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3500);
    setTimeout(() => setMsg(), 3000);
    setTimeout(() => setSuccess(), 3000);
  }, [errorMsg, msg, success]);

  const getUser = async () => {
    setIsLoading(true);
    try {
      let response = await axiosInstance.get(`/api/get_user/`);
      if (response.status === 200) {
        setUser(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      let url = ""
      if(currentShopifyToken){
        url =  "cancel_shopify_subscription"
      }
      else{
        url = "cancel_subscription"
      }

      let response = await axiosInstance.post(`/stripe/${url}/`);

      if (response.status === 200) {
        console.log("cancelled");
        setSuccess(
          "Subscription cancelled you will still have access at the end of the billing period."
        );
      } else if (response.status === 204) {
        setSuccess("Subscription already cancelled!");
      }
    } catch (error) {
      console.log("error", error.response.status);
      if (error.response.status === 404) {
        setErrorMsg(error.response?.data.error);
      }
      else{
console.log(error);
      setErrorMsg("There has been an error, contact support!");
      }
      
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
            <PackageInformation />
            <div className="flex md:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />
            </div>
            {/* Cancel Subscription Section */}
            <div className="flex md:flex-row xs:flex-col">
              <div className="mx-20 p-4 w-full">
                <h3 className="flex flex-row items-center xs:text-normal lg:text-xl 2xl:text-2xl text-left mb-4 font-normal text-white relative border-b-2 border-gray-800">
                  Cancel Subscription
                  <button
                    onClick={() => setShowSubModal(true)}
                    className="px-1 py-1 bg-red-700 lg:text-sm 2xl:text-xl text-white rounded-lg hover:bg-red-600 absolute -right-2 -top-2 shadow-md"
                  >
                    Cancel Subscription
                  </button>
                </h3>

                <p className="text-white/60 xs:text-sm lg:text-normal text-start mb-4">
                  If you wish to stop your current subscription, click the
                  button below. You’ll still have access until the end of your
                  billing period.
                </p>
                {success && (
                  <span className="text-green-500 text-sm font-euclid">
                    {success}
                  </span>
                )}
                {errorMsg && (
                  <span className="text-red-500 text-sm font-euclid">
                    {errorMsg}
                  </span>
                )}
              </div>
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
        <CancelSubscription
          showModal={showSubModal}
          onClose={(e) => setShowSubModal(false)}
          cancelConfirm={cancelSubscription}
        />
      </div>
    </section>
  );
};

export default UserPage;
