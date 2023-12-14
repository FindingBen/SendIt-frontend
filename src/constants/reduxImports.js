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
export const useRedux = () => {
  const dispatch = useDispatch();
  const currentToken = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const currentPageState = useSelector(selectEditPageState);
  const currentModalCall = useSelector(selectModalCall);
  const currentModalState = useSelector(selectModalState);
  const currentFormState = useSelector(selectFormState);

  return {
    dispatch,
    currentToken,
    currentUser,
    currentPageState,
    currentModalCall,
    currentModalState,
    currentFormState,
  };
};
