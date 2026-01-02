import { useDispatch } from "react-redux";
import { addNotification } from "./redux/reducers/notificationReducer";
import useNotificationSocket from "./hooks/useNotificationSocket";

const NotificationBootstrap = () => {
  const dispatch = useDispatch();

  const handleNotification = (data) => {
    const payload = data.payload || data || {};
    const event = payload.event || payload.type;
    if (!event) return;

    if (event === "OPTIMIZATION_DONE") {
      dispatch(addNotification({
        id: payload.job_id,
        type: event,
        productId: payload.product_id,
        message: "Product optimization completed",
        read: false,
        action: {
          label: "View result",
          to: `/product_optimize/${payload.product_id}`
        }
      }));
    }

    if (event === "OPTIMIZATION_FAILED") {
      dispatch(addNotification({
        id: payload.job_id,
        type: event,
        productId: payload.product_id,
        message: "Product optimization failed",
        read: false,
      }));
    }
  };

  useNotificationSocket({
    path: "/ws/notifications/",
    onMessage: handleNotification,
  });

  return null; // renders nothing
};

export default NotificationBootstrap;
