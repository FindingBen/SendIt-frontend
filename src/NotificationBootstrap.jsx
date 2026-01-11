import { useDispatch } from "react-redux";
import useNotificationSocket from "./hooks/useNotificationSocket";
import useAxiosInstance from "./utils/axiosInstance";
import { upsertNotification } from "./redux/reducers/notificationReducer";

const NotificationBootstrap = () => {
  const dispatch = useDispatch();
  const axios = useAxiosInstance();
  console.log("NotificationBootstrap mounted");
  const handleNotification = async (data) => {
    const notificationId = data.notification_id;
    if (!notificationId) return;

    try {
      console.log("Fetching notification with ID:", notificationId);
      const res = await axios.get(`/notifications/get_notifications/${notificationId}/`);
      console.log("Fetched notification data:", res.data);
      dispatch(upsertNotification(res.data));
    } catch (err) {
      console.error("Failed to fetch notification", err);
    }
  };

  useNotificationSocket({
    path: "/ws/notifications/",
    onMessage: handleNotification,
  });

  return null;
};

export default NotificationBootstrap;
