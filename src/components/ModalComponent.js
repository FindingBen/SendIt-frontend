import { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { selectFormState, setState } from "../features/modal/formReducer";
import {
  setModalState,
  setOpenModal,
  selectModalState,
} from "../features/modal/modalReducer";
import { useSelector, useDispatch } from "react-redux";
import { ElementContext } from "../context/ElementContext";
function ModalComponent({ confirmLeave, showModal }) {
  const [show, setShow] = useState(showModal);
  const dispatch = useDispatch();
  const { createElement, deleteElement } = useContext(ElementContext);
  const handleClose = (e) => {
    confirmLeave();
    dispatch(setOpenModal({ open: true }));
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
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have some unsaved data, do you wish to navigate?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleStay}>
            Stay
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComponent;
