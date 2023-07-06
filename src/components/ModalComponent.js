import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { setState } from "../features/modal/formReducer";
import { setModalState, setOpenModal } from "../features/modal/modalReducer";
import { useDispatch } from "react-redux";
import { ElementContext } from "../context/ElementContext";
function ModalComponent({ confirmLeave, showModal }) {
  const [show, setShow] = useState(showModal);
  const dispatch = useDispatch();
  const { deleteElement } = useContext(ElementContext);
  const handleClose = (e) => {
    confirmLeave();
    dispatch(setOpenModal({ open: false }));
    dispatch(setModalState({ show: false }));
    dispatch(setState({ isDirty: false }));
    setShow(false);
    deleteElement();
  };

  const handleStay = () => {
    setShow(false);
    dispatch(setModalState({ show: false }));
    dispatch(setOpenModal({ open: false }));
  };

  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    if (showModal) {
      handleShow();
    }
  }, [showModal]);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button> */}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Warning!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
              />
            </svg>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have some unsaved data, do you wish to navigate?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-red-800 hover:bg-gray-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={handleClose}
          >
            Yes
          </button>
          <button
            className="bg-gray-800 hover:bg-green-400 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={handleStay}
          >
            Stay
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComponent;
