import { ButtonBase, Grid, Typography } from "@mui/material";
import { logout } from "components/Auth";
import RightArrowIcon from "components/Icons/RightArrow";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPlan } from "utils/common";
import { useGlobalContext, useSubscription } from "utils/hooks";

const MENU_ITEMS = [
  {
    title: "General Settings",
    path: "/settings",
  },
  {
    title: "Notifications",
    path: "/settings/notifications",
  },
  {
    title: "Connect Bot",
    path: "/settings/connect",
  },
  {
    title: "Payments",
    path: "/settings/payments",
  },
  {
    title: "Team",
    path: "/settings/team",
  },
  {
    title: "Reward Methods",
    disabled: true,
    path: "/settings/reward-methods",
  },
  {
    title: "Log out",
    path: null,
    action: logout,
  },
];

MENU_ITEMS.splice(1, 0, {
  title: "Billing",
  path: "/settings/billing",
});
MENU_ITEMS.join();
const MenuSwitcher = () => {
  const location = useLocation();
  const { activeOrg } = useGlobalContext();
  const navigate = useNavigate();
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  if (
    (plan === PricingOptionsTitle.Premium || plan === PricingOptionsTitle.Ecosystem) &&
    !MENU_ITEMS.some((item) => item?.title === "Community NFTs")
  ) {
    MENU_ITEMS.splice(4, 0, {
      title: "Community NFTs",
      path: "/settings/nft",
    });
  }
  return (
    <Grid
      display="flex"
      bgcolor="#2A8D5C"
      gap="4px"
      padding="9px"
      flexDirection="column"
      alignItems="flex-start"
      borderRadius="12px"
      width={{
        xs: "100%",
        sm: "30%",
      }}
      flexBasis={{
        xs: "100%",
        sm: "30%",
      }}
    >
      {MENU_ITEMS.map((item, idx) => {
        const isActive = item.path === location.pathname && !item.disabled;
        return (
          <ButtonBase
            disabled={item.disabled}
            onClick={() => {
              item?.action?.();
              if (item.path) {
                return navigate(item.path);
              }
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              backgroundColor: isActive ? "#F8AFDB" : "transparent",
              padding: "8px",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#F8AFDB",
              },
            }}
          >
            <Typography
              fontFamily="Poppins"
              fontSize="13px"
              fontWeight={600}
              sx={{
                opacity: item.disabled ? 0.5 : 1,
              }}
              color={isActive ? "black" : "white"}
              lineHeight="15px"
            >
              {item.title}
            </Typography>
            {isActive && <RightArrowIcon />}
          </ButtonBase>
        );
      })}
    </Grid>
  );
};

export default MenuSwitcher;
