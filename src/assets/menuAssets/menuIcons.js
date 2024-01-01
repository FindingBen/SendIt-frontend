import HomeIcon from "./iconComponents/HomeIcon";
import CreateIcon from "./iconComponents/CreateIcon";
import ContactLists from "./iconComponents/ContactLists";
import AccountIcon from "./iconComponents/AccountIcon";

export const menu = [
  {
    id: 1,
    element: <HomeIcon />,
    title: "Home",
    location: "/home",
  },
  {
    id: 2,
    element: <CreateIcon />,
    title: "Create",
    location: "/create_note/",
  },
  {
    id: 3,
    element: <ContactLists />,
    title: "Contacts",
    location: "/contact_lists/",
  },
  {
    id: 4,
    element: <AccountIcon />,
    title: "Account",
    location: "/account_settings/",
  },
];
