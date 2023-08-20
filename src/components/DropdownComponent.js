import React, { useState, useEffect } from "react";
import { Dropdown } from "flowbite-react";

const DropdownComponent = ({ listItems, isOpenState, toggleDropdown }) => {
  const [listItem, setListItem] = useState(listItems);
  const [isOpen, setIsOpen] = useState(isOpenState);
  useEffect(() => {
    setListItem(listItems);
    setIsOpen(isOpenState);
  }, [listItems, isOpen]);
  console.log("test");
  console.log(toggleDropdown);
  return (
    <Dropdown onClick={toggleDropdown} label="Select recipient list">
      {isOpenState && (
        <ul>
          {listItem?.map((item) => (
            <li key={item.id}>{item.list_name}</li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
};

export default DropdownComponent;
