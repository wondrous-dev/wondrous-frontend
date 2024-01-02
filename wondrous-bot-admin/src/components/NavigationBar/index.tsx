import { useContext } from "react";

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
import { useMediaQuery } from "@mui/material";

const NavigationBar = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { isEcosystemPlan } = useSubscriptionPaywall();

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

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
          props: {
            "data-tour": "sidebar-quest-item",
          },
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

  return isMobile ? <NavigationHeaderComponent links={LINKS} /> : <SidebarComponent links={LINKS} />;
};

export default NavigationBar;
