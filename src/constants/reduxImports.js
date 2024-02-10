import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../redux/reducers/authSlice";
import { selectEditPageState } from "../redux/reducers/editPageReducer";
import {
  selectModalCall,
  selectModalState,
} from "../redux/reducers/modalReducer";
import { selectFormState } from "../redux/reducers/formReducer";
import { selectCurrentPackage } from "../redux/reducers/packageReducer";
import { selectContactLists } from "../redux/reducers/contactListReducer";
import {
  selectMessages,
  selectMessagesCount,
} from "../redux/reducers/messageReducer";
import { selectOperationState } from "../redux/reducers/messageReducer";

export const useRedux = () => {
  const dispatch = useDispatch();
  const currentToken = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const currentPageState = useSelector(selectEditPageState);
  const currentModalCall = useSelector(selectModalCall);
  const currentModalState = useSelector(selectModalState);
  const currentFormState = useSelector(selectFormState);
  const currentPackageState = useSelector(selectCurrentPackage);
  const currentContactList = useSelector(selectContactLists);
  const currentMessages = useSelector(selectMessages);
  const currentMessagesCount = useSelector(selectMessagesCount);
  const currentOperationState = useSelector(selectOperationState);

  return {
    dispatch,
    currentToken,
    currentUser,
    currentPageState,
    currentModalCall,
    currentModalState,
    currentFormState,
    currentPackageState,
    currentContactList,
    currentMessages,
    currentMessagesCount,
    currentOperationState,
  };
};
