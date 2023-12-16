import {
  Divider,
  ButtonBase,
  Box,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { Link, useLocation } from "react-router-dom";
import { ImageDefault } from "components/Navbar/styles";
import { ChevronLeft } from "@mui/icons-material";
import { useState } from "react";
import { SidebarLabel } from "./styles";

const drawerWidth = 240;

const collapsedDrawerWidth = 64;

const LinksWrapper = ({ links, isCollapsed }) => {
  return links?.map((section, idx) => {
    return (
      <Box display="flex" flexDirection="column" gap="10px" padding="10px" key={`section-${idx}`}>
        {section?.sectionTitle ? (
          <SidebarLabel color="#949494">{isCollapsed ? null : section?.sectionTitle}</SidebarLabel>
        ) : null}
        {section?.items?.map((item, idx) => {
          const isActive = checkActive(item.path, location, item.partialMatch);
          return (
            <Link to={item.path} key={item.path}>
              <Box
                display="flex"
                gap="8px"
                bgcolor={isActive ? "#D7E9FF" : "transparent"}
                alignItems="center"
                borderRadius="6px"
                padding="10px"
                sx={{
                  "&:hover": {
                    backgroundColor: "#EEE",
                  },
                }}
              >
                {isActive ? item.activeIcon?.() : item.inactiveIcon?.()}

                {isCollapsed ? null : <SidebarLabel>{item.label}</SidebarLabel>}
              </Box>
            </Link>
          );
        })}
      </Box>
    );
  });
};

const checkActive = (path, location, partialMatch = false) => {
  if (partialMatch) {
    return location.pathname.includes(path);
  }
  return location.pathname === path;
};

const SidebarComponent = ({ links, bottomLinks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();

  const drawer = (
    <Box sx={{ paddingTop: "14px" }} display="flex" flexDirection="column" gap="42px" alignItems="space-between">
      <Box
        display="flex"
        justifyContent={isCollapsed ? "center" : "space-between"}
        alignItems="center"
        sx={{
          paddingLeft: isCollapsed ? "0" : "10px",
          paddingRight: isCollapsed ? "0" : "14px",
        }}
      >
        <Link to="/">
          <ImageDefault
            src="/wonder.svg"
            style={{
              width: isCollapsed ? "38px" : "auto",
              height: isCollapsed ? "38px" : "auto",
            }}
          />
        </Link>
        <ButtonBase
          onClick={() => setIsCollapsed((prev) => !prev)}
          sx={{
            position: isCollapsed ? "absolute" : "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid black",
            borderRadius: "100px",
            background: "white",
            right: isCollapsed ? "-25%" : "0",
          }}
        >
          <ChevronLeft />
        </ButtonBase>
      </Box>
      <Box display="flex" flexDirection="column" gap="24px">
        <LinksWrapper links={links} isCollapsed={isCollapsed} />
      </Box>
      <Box flex="1" />
      <Box display="flex" flexDirection="column" gap="24px">
        <LinksWrapper links={bottomLinks} isCollapsed={isCollapsed} />
      </Box>
      <Divider />
      <Box display="flex" flexDirection="column" gap="24px"></Box>
    </Box>
  );
  return (
    <Drawer
      variant="persistent"
      open
      anchor="left"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        transition: "all 0.2s ease-in-out",
        "& .MuiDrawer-paper": {
          transition: "all 0.2s ease-in-out",
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: "border-box",
          overflow: isCollapsed ? "visible" : "hidden",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default SidebarComponent;
