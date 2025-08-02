import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/LoaderSkeleton/Loader";
import Modal from "react-bootstrap/Modal";
import { useRedux } from "../../constants/reduxImports";
import useAxiosInstance from "../../utils/axiosInstance";
import { setContactLists } from "../../redux/reducers/contactListReducer";
import { setUserInfo } from "../../redux/reducers/userReducer";

const ShopifyUsersImportModal = ({ showShopify, onClose, bulkContacts }) => {
  const { dispatch } = useRedux();
  const [show, setShowModal] = useState(showShopify);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const params = useParams();

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    setShowModal(showShopify);
  }, [showShopify]);

  const closeModal = () => {
    onClose();
    setErrMsg("");
  };

  const bulkCreate = async () => {
    setLoading(true);
    try {
      const body = {
        list_id: params.id,
      };
      let response = await axiosInstance.post(
        "/api/create_bulk_contacts/",
        body
      );
      if (response.status === 200 || 201) {
        setLoading(false);

        bulkContacts(response.data.data);
        dispatch(
          setContactLists({
            contactLists: [],
            listChange: true,
          })
        );
        dispatch(setUserInfo({ shopify_connect: true }));
        closeModal();
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      {show ? (
        <>
          <Modal
            show={show}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            {/*content*/}
            <div className="relative border-2 border-gray-800 flex flex-col w-full bg-ngrokGray">
              {/*header*/}
              <span className="text-2xl font-euclid p-6 text-slate-400">
                Import shopify customers
              </span>
              {/*body*/}
              <div className="relative p-6 flex-auto mx-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed font-euclid">
                  This action will import your shopify customers. By doing that
                  this list automatically gets flagged as shopify list. Meaning
                  that every user that you add or delete here in this specific
                  list, will also reflect changes to your shopify store.{" "}
                  <br></br>
                </p>
                <p className="text-slate-500 text-lg leading-relaxed font-euclid">
                  Also if you add customers in shopify, this list will be
                  automatically synchronized with your customers.
                </p>

                {fieldErrors?.email && (
                  <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                )}
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {errMsg && (
                  <p className="text-red-700 font-semibold text-normal">
                    {errMsg}
                  </p>
                )}
                {loading ? (
                  <Loader color={true} loading_name={"Loading..."} />
                ) : (
                  <div className="flex flex-row gap-2">
                    <button
                      className="bg-red-700 hover:bg-gray-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                      type="button"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      className="bg-ngrokBlue hover:bg-blue-400 text-white font-euclid py-2 px-4 rounded-md duration-200"
                      type="button"
                      onClick={bulkCreate}
                    >
                      Import
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Modal>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ShopifyUsersImportModal;
