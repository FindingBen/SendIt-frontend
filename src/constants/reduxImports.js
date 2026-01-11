import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentDomain,
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
import { selectCurrentSmsCount } from "../redux/reducers/packageReducer";
import { selectContactLists } from "../redux/reducers/contactListReducer";
import {
  selectMessages,
  selectMessagesCount,
} from "../redux/reducers/messageReducer";
import { selectOperationState } from "../redux/reducers/messageReducer";
import { selectCurrentUserState } from "../redux/reducers/userReducer";
import { selectTokenType } from "../redux/reducers/authSlice";
import { selectArchiveStateState } from "../redux/reducers/archiveReducer";
import { selectCampaigns } from "../redux/reducers/completedCampaignsReducer";
import { selectShopifyToken } from "../redux/reducers/authSlice";
import { selectCurrentShopId } from "../redux/reducers/authSlice";
import { selectUnreadCount } from "../redux/reducers/notificationReducer";
import { selectNotifications } from "../redux/reducers/notificationReducer";


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
  const currentUserState = useSelector(selectCurrentUserState);
  const currentSmsPackCount = useSelector(selectCurrentSmsCount);
  const currentArchivedState = useSelector(selectArchiveStateState);
  const currentCampaignsState = useSelector(selectCampaigns);
  const currentTokenType = useSelector(selectTokenType);
  const currentDomain = useSelector(selectCurrentDomain);
  const currentShopifyToken = useSelector(selectShopifyToken);
  const currentShopId = useSelector(selectCurrentShopId);
  const currentUnreadCount = useSelector(selectUnreadCount);
 const currentNotifications = useSelector(selectNotifications);

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
    currentUserState,
    currentSmsPackCount,
    currentArchivedState,
    currentCampaignsState,
    currentTokenType,
    currentDomain,
    currentShopifyToken,
    currentShopId,
    currentUnreadCount,
    currentNotifications
  };
};
