import { useTheme } from "@mui/material";
import { useContext, useState } from "react";

import { useLocation } from "react-router-dom";
import GlobalContext from "utils/context/GlobalContext";
import { useSubscriptionPaywall } from "utils/hooks";
import SidebarComponent from "components/NavigationBar/Sidebar";
import {
  ActiveAnalyticsIcon,
  ActiveHomeIcon,
  ActiveLevelsIcon,
  ActiveMembersIcon,
  ActiveQuestsIcon,
  ActiveReferralsIcon,
  ActiveStoreIcon,
  InactiveAnalyticsIcon,
  InactiveHomeIcon,
  InactiveLevelsIcon,
  InactiveMembersIcon,
  InactiveQuestsIcon,
  InactiveReferralsIcon,
  InactiveStoreIcon,
} from "components/Icons/Sidebar";
import NavigationHeaderComponent from "./NavigationHeader";

// const LINKS = [
//   {
//     path: "/",
//     label: "Home",
//     textColor: "#BAACFA",
//   },
//   {
//     path: "/members",
//     label: "Members",
//     textColor: "#F8642D",
//   },
//   {
//     path: "/quests",
//     label: "Quests",
//     textColor: "#F8AFDB",
//     partialMatch: true,
//   },
//   {
//     path: "/levels",
//     label: "Levels",
//     textColor: "#84BCFF",
//   },
//   {
//     path: "/analytics",
//     label: "Analytics",
//     textColor: "#FEE2CA",
//   },
// ];
const NavigationBar = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const theme: any = useTheme();
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const { isEcosystemPlan } = useSubscriptionPaywall();

  const LINKS = [
    {
      sectionTitle: null,
      items: [
        {
          path: "/",
          label: "Home",
          activeIcon: ActiveHomeIcon,
          inactiveIcon: InactiveHomeIcon,
        },
      ],
    },
    {
      sectionTitle: "Engage",
      items: [
        {
          path: "/quests",
          activeIcon: ActiveQuestsIcon,
          inactiveIcon: InactiveQuestsIcon,
          label: "Quests",
          partialMatch: true,
        },
        {
          path: "/referrals",
          label: "Referrals",
          activeIcon: ActiveReferralsIcon,
          isInactive: !activeOrg?.modules?.cmtyReferral,
          inactiveIcon: InactiveReferralsIcon,
        },
      ],
    },
    {
      sectionTitle: "CRM",
      items: [
        {
          path: "/members",
          label: "Members",
          activeIcon: ActiveMembersIcon,
          inactiveIcon: InactiveMembersIcon,
        },
        {
          path: "/levels",
          label: "Levels",
          activeIcon: ActiveLevelsIcon,
          inactiveIcon: InactiveLevelsIcon,
        },
        {
          path: "/analytics",
          activeIcon: ActiveAnalyticsIcon,
          inactiveIcon: InactiveAnalyticsIcon,
          label: "Analytics",
        },
      ],
    },
    {
      sectionTitle: "Monetize",
      isInactive: !isEcosystemPlan,
      items: [
        {
          path: "/store",
          label: "Store",
          isInactive: !isEcosystemPlan,
          activeIcon: ActiveStoreIcon,
          inactiveIcon: InactiveStoreIcon,
          partialMatch: true,
        },
      ],
    },
  ];

  return (
    <>
      <NavigationHeaderComponent links={LINKS} />
      <SidebarComponent links={LINKS} />
    </>
  );
};

export default NavigationBar;
