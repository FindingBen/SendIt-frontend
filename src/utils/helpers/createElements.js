export const createElements =
  ({
    elementContextList,
    messageObject,
    axiosInstance,
    BASE_URL,
    requestType,
  }) =>
  async () => {
    const createdElements = [];
    if (requestType === "copy") {
      elementContextList?.map(async (element) => {
        const formData = new FormData();

        if (element.element_type === "Img") {
          try {
            const response = await fetch(`${BASE_URL}${element.image}`);
            const blob = await response.blob();
            const fileImage = new File([blob], "image.png", {
              type: "image/png",
            });
            formData.append("image", fileImage);
          } catch (error) {
            console.error("Error fetching or processing image:", error);
          }
        } else if (element.element_type === "Text") {
          formData.append("text", element.text);
          formData.append("alignment", element.alignment);
        } else if (element.element_type === "Carousel") {
          formData.append(
            "carousel_images",
            JSON.stringify(element.carousel_images[0])
          );
        } else if (element.element_type === "Button") {
          formData.append("unique_button_id", element.unique_button_id);
          formData.append(
            "button_link_track",
            `https://spp.up.railway.app/sms/sms/button/${element.unique_button_id}`
          );
          formData.append("button_title", element.button_title);
          formData.append("button_link", element.button_link);
          formData.append("button_color", element.button_color);
        } else if (element.element_type === "Survey") {
          formData.append("survey", element.survey);
          formData.append("question_type", element.question_type);
        }
        formData.append("element_type", element.element_type);
        formData.append("order", element.order);

        formData.append("message", messageObject);

        try {
          let response = await axiosInstance.post(
            "/api/create_element/",
            formData
          );
          console.log(response);
          if (response.status === 200) {
            createdElements.push(response.data);
          } else {
            console.log("Failed to create element:", element);
            return undefined; // Return undefined to indicate a failure
          }
        } catch (e) {
          console.log(e);
        }
      });
      return createdElements;
    } else {
      try {
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
              formData.append(
                "unique_button_id",
                elementContext.unique_button_id
              );
              formData.append(
                "button_link_track",
                `https://spp.up.railway.app/sms/sms/button/${elementContext.unique_button_id}`
              );
              formData.append("button_color", elementContext.button_color);
            } else if (elementContext.element_type === "Survey") {
              formData.append("survey", elementContext.survey);
              formData.append("question_type", elementContext.question_type);
            } else if (elementContext.element_type === "Carousel") {
              formData.append(
                "carousel_images",
                JSON.stringify(elementContext.carousel_images[0])
              );
            }

            formData.append("element_type", elementContext.element_type);
            formData.append("users", elementContext.users);
            formData.append("order", i);

            formData.append("message", messageObject);
            console.log(formData);
            let response = await axiosInstance.post(
              "/api/create_element/",
              formData
            );

            if (response.status === 200) {
              createdElements.push(response.data);
            } else {
              console.log("Failed to create element:", elementContext);
              return undefined; // Return undefined to indicate a failure
            }
          }
        }

        //setElementsList((prevElement) => prevElement.concat(createdElements));
        return createdElements; // Return the created elements from the function
      } catch (error) {
        console.log("Error creating elements:", error);
        return; // Return undefined to indicate a failure
      }
    }
  };
