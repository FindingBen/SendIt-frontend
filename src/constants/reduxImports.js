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
  };
};
