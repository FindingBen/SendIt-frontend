import { createElements } from "./createElements";

export const duplicateMessage =
  ({
    messageId,
    axiosInstance,
    currentUser,
    BASE_URL,
    currentMessages,
    setShowCopy,
    dispatch,
    setMessages,
    setLoading,
  }) =>
  async () => {
    setShowCopy(true);
    try {
      setLoading(true);
      // Fetch details of the existing message
      const existingMessageResponse = await axiosInstance.get(
        `/api/view/${messageId}/`
      );

      if (existingMessageResponse.status !== 200) {
        console.error("Failed to fetch existing message details");
        return;
      }

      const existingMessage = existingMessageResponse.data.message;

      // Create a new message with the fetched details
      const duplicateMessageResponse = await axiosInstance.post(
        "/api/create_notes/",
        {
          users: currentUser,
          message_name: `${existingMessage.message_name}`,
        }
      );

      if (duplicateMessageResponse.status !== 200) {
        console.error("Failed to create a duplicate message");
        return;
      }

      const messageObject = duplicateMessageResponse.data.note.id;
      const elementContextList = existingMessageResponse.data.elements;
      const requestType = "copy";
      const createElementsData = createElements({
        elementContextList,
        messageObject,
        axiosInstance,
        BASE_URL,
        requestType,
      });

      await createElementsData();
      if (duplicateMessageResponse.status === 200) {
        const updatedMessageList = [
          ...currentMessages,
          duplicateMessageResponse.data.note,
        ];
        dispatch(setMessages(updatedMessageList));
      }
      setTimeout(() => setShowCopy(false), 1000);
      setLoading(false);
    } catch (error) {
      console.error("Error duplicating message:", error);
    }
  };
