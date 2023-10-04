import { Box, Grid, Typography, Drawer, useTheme } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { DefaultLink } from "components/Shared/styles";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

import { HeaderBar, HoveredImage, ImageContainer, ImageDefault, LinkButton, MenuIconWrapper } from "./styles";
import { Link, useLocation } from "react-router-dom";
import { HEADER_HEIGHT } from "utils/constants";
import CloseIcon from "@mui/icons-material/Close";
import WorkspaceSwitch from "components/WorkspaceSwitch";

const checkActive = (path, location, partialMatch = false) => {
  if (partialMatch) {
    return location.pathname.includes(path);
  }
  return location.pathname === path;
};

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const theme: any = useTheme();
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const LINKS = [
    {
      path: "/",
      label: "HOME",
      activeBgColor: "#BAACFA",
    },
    {
      path: "/members",
      label: "MEMBERS",
      activeBgColor: "#F8642D",
    },
    {
      path: '/quests',
      label: 'QUESTS',
      activeBgColor: '#F8AFDB',
      partialMatch: true,
    },
    {
      path: '/levels',
      label: 'LEVELS',
      activeBgColor: '#FEE2CA',
    },
    {
      path: '/analytics',
      label: 'ANALYTICS',
      activeBgColor: '#FFCB5D',
    }
  ];

  return (
    <HeaderBar>
      <Link to="/">
        <ImageContainer>
        <ImageDefault src="/wonder.svg"/>
        <HoveredImage src="/wonder-colored.svg" />
        </ImageContainer>
      </Link>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Grid
          container
          display="flex"
          gap="42px"
          alignItems="center"
          bgcolor="#1E1E1E"
          borderRadius="80px"
          padding="4px 0px"
        >
          {LINKS.map((link) => {
            const isActive = checkActive(link.path, location, link.partialMatch);
            return (
              <Grid
                item
                key={link.label}
                bgcolor={isActive ? link.activeBgColor : "transparent"}
                padding="6px 28px"
                borderRadius="60px"
              >
                <DefaultLink to={link.path}>
                  <Typography
                    fontFamily="Poppins"
                    fontWeight={600}
                    fontSize="13px"
                    lineHeight="16px"
                    color={isActive ? "black" : "#BAACFA"}
                  >
                    {link.label}
                  </Typography>
                </DefaultLink>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <WorkspaceSwitch />
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <MenuIconWrapper onClick={toggleDrawer}>
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
                <LinkButton bgColor={link.activeBgColor}>
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
