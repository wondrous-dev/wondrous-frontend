import { Box, Grid, Typography, Drawer, useTheme } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { DefaultLink } from "components/Shared/styles";
import { useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import {
  HeaderBar,
  HoveredImage,
  ImageContainer,
  ImageDefault,
  LinkButton,
  MenuIconWrapper,
  NavbarLinkText,
  NavbarLinkWrapper,
} from "./styles";
import { Link, useLocation } from "react-router-dom";
import { HEADER_HEIGHT } from "utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import WorkspaceSwitch from "components/WorkspaceSwitch";
import GlobalContext from "utils/context/GlobalContext";
import { useSubscriptionPaywall } from "utils/hooks";

const checkActive = (path, location, partialMatch = false) => {
  if (partialMatch) {
    return location.pathname.includes(path);
  }
  return location.pathname === path;
};
const LINKS = [
  {
    path: "/",
    label: "Home",
    textColor: "#BAACFA",
  },
  {
    path: "/members",
    label: "Members",
    textColor: "#F8642D",
  },
  {
    path: "/quests",
    label: "Quests",
    textColor: "#F8AFDB",
    partialMatch: true,
  },
  {
    path: "/levels",
    label: "Levels",
    textColor: "#84BCFF",
  },
  {
    path: "/analytics",
    label: "Analytics",
    textColor: "#FEE2CA",
  },
];
const Header = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const theme: any = useTheme();
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const { isPremiumPlan } = useSubscriptionPaywall();

  if ((isPremiumPlan || isEcosystemPlan) && !LINKS.some((link) => link.path === "/store")) {
    LINKS.splice(3, 0, {
      path: "/store",
      label: "Store",
      textColor: "#30BA76",
      partialMatch: true,
    });
    if (activeOrg?.modules?.cmtyReferral && !LINKS.some((link) => link.path === "/referrals")) {
      LINKS.splice(4, 0, { path: "/referrals", label: "Referrals", textColor: "#E9FF90", partialMatch: true });
    }
  } else {
    if (activeOrg?.modules?.cmtyReferral && !LINKS.some((link) => link.path === "/referrals")) {
      LINKS.splice(3, 0, { path: "/referrals", label: "Referrals", textColor: "#E9FF90", partialMatch: true });
    }
  }

  return (
    <HeaderBar>
      <Link to="/">
        <ImageContainer>
          <ImageDefault src="/wonder.svg" />
          <HoveredImage src="/wonder-colored.svg" />
        </ImageContainer>
      </Link>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Grid container display="flex" gap="26px" alignItems="center" padding="4px 0px">
          {LINKS.map((link) => {
            const isActive = checkActive(link.path, location, link.partialMatch);
            return (
              <DefaultLink to={link.path}>
                <NavbarLinkWrapper item key={link.label} color={link.textColor}>
                  <NavbarLinkText
                    color={isActive ? link.textColor : "#E8E8E8"}
                    borderBottomColor={isActive ? link.textColor : "transparent"}
                  >
                    {link.label}
                  </NavbarLinkText>
                </NavbarLinkWrapper>
              </DefaultLink>
            );
          })}
        </Grid>
      </Box>
      <WorkspaceSwitch />
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <MenuIconWrapper onClick={toggleDrawer} $isOpen={drawerOpen}>
          {drawerOpen ? (
            <CloseIcon
              sx={{
                color: "black",
              }}
            />
          ) : (
            <MenuIcon
              sx={{
                color: "black",
              }}
            />
          )}
        </MenuIconWrapper>
        <Drawer
          anchor="top"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              top: HEADER_HEIGHT,
              padding: "1rem",
              backgroundColor: theme.palette.background?.header,
            },
            display: {
              xs: "",
              md: "none",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
            display="flex"
            flexDirection="column"
            gap="24px"
          >
            {LINKS.map((link) => (
              <DefaultLink to={link.path} key={link.label} onClick={toggleDrawer}>
                <LinkButton bgColor={link.textColor}>
                  {link.label}
                  <ArrowOutwardIcon
                    sx={{
                      fontWeight: 700,
                    }}
                  />
                </LinkButton>
              </DefaultLink>
            ))}
          </Box>
        </Drawer>
      </Box>
    </HeaderBar>
  );
};

export default Header;
