export const createElements =
  ({ elementContextList, messageObject, axiosInstance }) =>
  async () => {
    try {
      const createdElements = [];
      console.log("CONTEXT", elementContextList);
      for (let i = 0; i < elementContextList.length; i++) {
        const elementContext = elementContextList[i];
        const formData = new FormData();
        if ("context" in elementContext) {
          if (elementContext.element_type === "Img") {
            formData.append("image", elementContext.file);
          } else if (elementContext.element_type === "Text") {
            formData.append("text", elementContext.text);
            formData.append("alignment", elementContext.alignment);
          } else if (elementContext.element_type === "Button") {
            formData.append("button_title", elementContext.button_title);
            formData.append("button_link", elementContext.button_link);
            formData.append("button_color", elementContext.button_color);
          }
          formData.append("element_type", elementContext.element_type);
          formData.append("users", elementContext.users);
          formData.append("order", i);
          formData.append("message", messageObject);

          let response = await axiosInstance.post(
            "/api/create_element/",
            formData
          );

          //let data = await response.json();
          console.log(response.data);
          if (response.status === 200) {
            createdElements.push(response.data);
          } else {
            console.log("Failed to create element:", elementContext);
            return; // Return undefined to indicate a failure
          }
        }
      }

      //setElementsList((prevElement) => prevElement.concat(createdElements));
      return createdElements; // Return the created elements from the function
    } catch (error) {
      console.log("Error creating elements:", error);
      return; // Return undefined to indicate a failure
    }
  };
