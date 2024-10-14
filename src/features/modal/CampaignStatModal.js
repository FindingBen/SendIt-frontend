import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { useRedux } from "../../constants/reduxImports";
import PerformanceBar from "../../components/Progress/PerformanceBar";

const CampaignStatModal = ({ showModalCamp, onClose, campaignObject }) => {
  const [show, setShowModal] = useState(showModalCamp);

  useEffect(() => {
    setShowModal(showModalCamp);
  }, [showModalCamp]);

  const closeModal = () => {
    onClose();
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
            <div className="relative w-[560px]">
              {/*content*/}
              <div className="rounded-lg shadow-lg relative flex flex-col bg-gray-800 outline-none focus:outline-none">
                {/*header*/}
                <div className="p-4">
                  <p className="text-sm lg:text-2xl text-white">
                    Statistics for {campaignObject.name}
                  </p>
                </div>
                {/*body*/}

                <div class="relative overflow-x-auto shadow-md">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase  dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-2">
                          Start Date
                        </th>
                        <th scope="" class="px-6 whitespace-nowrap py-2">
                          End Date
                        </th>
                        <th scope="col" class="px-6 py-2">
                          Clicks
                        </th>
                        <th scope="col" class="px-6 py-2">
                          Views
                        </th>
                        <th scope="col" class="px-6 py-2">
                          Audience
                        </th>
                        <th scope="col" class="px-6 py-2">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class=" dark:bg-gray-800">
                        <th
                          scope="row"
                          class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {campaignObject.campaign_start}
                        </th>
                        <td class="px-6 py-4 whitespace-nowrap">
                          {campaignObject.campaign_end}
                        </td>
                        <td class="px-6 py-4">{campaignObject.total_clicks}</td>
                        <td class="px-6 py-4">{campaignObject.engagement}</td>
                        <td class="px-6 py-4">{campaignObject.audience}</td>
                        <td class="px-6 py-4">
                          {
                            <PerformanceBar
                              performance={campaignObject.overall_performance}
                            />
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded duration-200"
                    type="button"
                    //onClick={addContact}
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CampaignStatModal;
