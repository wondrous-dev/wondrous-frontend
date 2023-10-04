import { ButtonBase, Grid, Typography } from "@mui/material";
import { logout } from "components/Auth";
import RightArrowIcon from "components/Icons/RightArrow";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalContext } from "utils/hooks";

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
let isCommunityNFTsAdded = false;
const MenuSwitcher = () => {
  const location = useLocation();
  const { activeOrg } = useGlobalContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !isCommunityNFTsAdded &&
      ((import.meta.env.VITE_PRODUCTION && activeOrg?.id === "45956686890926082") ||
        (import.meta.env.VITE_STAGING && activeOrg?.id === "89444950095167649") ||
        (!import.meta.env.VITE_STAGING && !import.meta.env.VITE_PRODUCTION))
    ) {
      MENU_ITEMS.splice(4, 0, {
        title: "Community NFTs",
        path: "/settings/nft",
      });
      isCommunityNFTsAdded = true;
    }
  }, [activeOrg?.id]);
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
