import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import useAxiosInstance from "../utils/axiosInstance";
import UserAccount from "../components/AccountSettings/UserAccount";
import RulesetEditor from "../components/AccountSettings/Ruleset";
import SmsPill from "../components/SmsPill/SmsPill";
import PasswordChange from "../utils/PasswordChange";
import { useRedux } from "../constants/reduxImports";
import PackageInformation from "../components/AccountSettings/PackageInformation";
import CloseAccountModal from "../features/modal/CloseAccountModal";
import CancelSubscription from "../features/modal/CancelSubscription";
import Search from "../components/SearchComponent/Search";
import BusinessRulesetModal from "../features/modal/BusinessRulesetModal";
import { setUserInfo } from "../redux/reducers/userReducer";
import { use } from "react";

const UserPage = () => {
  const axiosInstance = useAxiosInstance();
  const { currentUserState, currentPackageState, currentShopifyToken, dispatch } = useRedux();
  const [username, setUsername] = useState();
  const [enableBusinessRuleset, setEnableBusinessRuleset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [showModal, setShowModal] = useState(false);
  const [ruleset, setRuleset] = useState({})
  const [rulesetState, setRulesetState] = useState(currentUserState.business_ruleset || {});
  const [showImport, setShowImport] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [errorRuleMsg, setErrorRuleMsg] = useState();
  const [success, setSuccess] = useState();
  const [successRule, setSuccessRule] = useState();
  const [newName, setNewName] = useState();
  const [newLastName, setNewLastName] = useState();

  const [user, setUser] = useState({
    first_name: newName,
    last_name: newLastName,
    username: username,
    email: "",
  });
  console.log("RULESET:", ruleset);
  useEffect(() => {
    getUser();
  }, [msg]);

  useEffect(()=>{
    rulesetFetch()
  },[successRule])

  useEffect(() => {
    setTimeout(() => setErrorMsg(), 3500);
    setTimeout(() => setErrorRuleMsg(), 3500);
    setTimeout(() => setMsg(), 3000);
    setTimeout(() => setSuccess(), 3000);
    setTimeout(() => setSuccessRule(), 3000);
  }, [errorMsg, msg, success, successRule, errorRuleMsg]);

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

  const rulesetFetch = async () => {
    try{
      let response = await axiosInstance.get("/products/business_analysis/");
      if(response.status === 200){
        setRuleset(response.data);
      }
    }
    catch(error){
      console.log("Error fetching ruleset:", error);
    }
  }

  const businessRuleSetEnable = async (payload) => {
    try {
      let response = await axiosInstance.post("/products/business_analysis/",{payload});
      if(response.status === 200){
        setEnableBusinessRuleset(true);
        dispatch(setUserInfo({ business_analysis: true }));
        setSuccessRule("Business ruleset enabled successfully");
      }
      console.log("Business ruleset enabled",response);
    } catch (error) {
      console.log(error)
      setErrorRuleMsg("Error enabling business ruleset");
    }
  }

  const updateRuleset = async (partialUpdate) => {
    console.log("Updating ruleset with:", partialUpdate);
  try {
    const response = await axiosInstance.patch(
      "/products/business_analysis/",
      partialUpdate
    );

    if (response.status === 200) {
      setSuccessRule("Business ruleset updated successfully");
    }
  } catch (error) {
    console.error(error);
    setErrorRuleMsg("Error updating business ruleset");
  }
};

const handleRulesetUpdate = async (partialUpdate) => {
  // optimistic UI update
  setRulesetState((prev) => ({
    ...prev,
    ...partialUpdate,
  }));

  await updateRuleset(partialUpdate);
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
    <section className="min-h-screen max-w-screen items-center justify-center bg-[#0A0E1A]">
      <div className="flex flex-col">
        <div className="flex flex-row items-center mb-6 h-16 bg-[#111827]/70 backdrop-blur-lg sticky top-0 z-10 border-b border-[#1C2437]/40">
      <Search />
      <SmsPill />
    </div>
        <div className="flex flex-col gap-2 mx-44">
          <div className="flex flex-row gap-2">
            <UserAccount /> 
          <RulesetEditor rules={ruleset.ruleset || {}}
          onUpdate={handleRulesetUpdate}
          openRulesetModal={() => setShowImport(true)}
    rulesEnabled={currentUserState.business_analysis}
    />
          </div>
          <div className="flex flex-col gap-2">
            <PackageInformation />
            <div className="flex md:flex-row xs:flex-col">
              <PasswordChange user_obj={user} />
            </div>
         
            {/* Cancel Subscription Section */}
            <div className="flex md:flex-row xs:flex-col">
              <div className="mx-20 p-6 w-full bg-[#1B2233] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 relative">
                  <h3 className="text-xl 2xl:text-2xl font-euclid text-white">Cancel Subscription</h3>
                 
                  <button
                    onClick={() => setShowSubModal(true)}
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg 2xl:text-xl text-sm shadow-md transition-all"
                  >
                    Cancel Subscription
                  </button>
                </div>

                {/* Content */}
                <p className="text-white/60 xs:text-sm lg:text-normal text-start mb-4">
                  If you wish to stop your current subscription, click the button below. You’ll still have access until the end of your billing period.
                </p>

                {/* Messages */}
                {success && (
                  <span className="text-green-500 text-sm font-euclid">{success}</span>
                )}
                {errorMsg && (
                  <span className="text-red-500 text-sm font-euclid">{errorMsg}</span>
                )}
              </div>
            </div>


            <div className="flex flex-col rounded-2xl p-6 mx-20 bg-[#1B2233] shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
  {/* Header */}
  <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 relative">
    <h3 className="text-xl 2xl:text-2xl font-euclid text-white">Account Deletion</h3>
    <div
      onClick={(e) => setShowModal(e)}
      className="px-4 py-2 bg-red-700 hover:bg-red-500 text-white text-sm 2xl:text-lg rounded-md cursor-pointer transition-all shadow-md"
    >
      Close Account
    </div>
  </div>

  {/* Content */}
  <p className="text-white/60 xs:text-sm lg:text-normal text-start">
    If you wish to close your account, press the button and we will do the rest.
  </p>
</div>

          </div>
        </div>
                <BusinessRulesetModal
                showModal={showImport}
                createRuleset={businessRuleSetEnable}
                onClose={(e) => setShowImport(false)}/>
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
