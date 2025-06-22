import HomeIcon from "./iconComponents/HomeIcon";
import CreateIcon from "./iconComponents/CreateIcon";
import ContactLists from "./iconComponents/ContactLists";
import AccountIcon from "./iconComponents/AccountIcon";
import ArchiveIcon from "./iconComponents/ArchiveIcon";
import PurchaseIcon from "./iconComponents/PurchaseIcon";
import Dashboard from "./iconComponents/Dashboard";

export const menu = [
  {
    id: 1,
    element: <HomeIcon />,
    title: "Home",
    location: "/home",
  },
  {
    id: 2,
    element: <Dashboard />,
    title: "Dashboard",
    location: "/dashboard",
  },
  {
    id: 3,
    element: <CreateIcon />,
    title: "Create",
    location: "/create_campaign/",
  },
  {
    id: 4,
    element: <ContactLists />,
    title: "Contacts",
    location: "/contact_lists/",
  },
  {
    id: 5,
    element: <AccountIcon />,
    title: "Account",
    location: "/account_settings/",
  },
  {
    id: 6,
    element: <PurchaseIcon />,
    title: "Purchase",
    location: "/purchase_history",
  },
  {
    id: 7,
    element: <ArchiveIcon />,
    title: "Archives",
    location: "/archive/",
  },
];
