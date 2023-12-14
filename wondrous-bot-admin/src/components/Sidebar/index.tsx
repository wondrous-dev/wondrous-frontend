import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ButtonBase,
  Box,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Link, useLocation } from "react-router-dom";
import { ImageDefault } from "components/Navbar/styles";
import { ChevronLeft } from "@mui/icons-material";
import { useState } from "react";

const drawerWidth = 240;

const collapsedDrawerWidth = 64;

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
        {links?.map((section, idx) => {
          return (
            <Box display="flex" flexDirection="column" gap="10px" padding="10px">
              {section?.sectionTitle ? (
                <Typography
                  padding="10px"
                  fontFamily="Poppins"
                  fontSize="14px"
                  fontWeight={500}
                  color="#949494"
                  lineHeight="14px"
                >
                  {isCollapsed ? null : section?.sectionTitle}
                </Typography>
              ) : null}
              {section?.items?.map((item, idx) => {
                const isActive = checkActive(item.path, location, item.partialMatch);
                return (
                  <Link to={item.path}>
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

                      {isCollapsed ? null : (
                        <Typography
                          fontFamily="Poppins"
                          color="black"
                          fontSize="14px"
                          fontWeight={500}
                          lineHeight="14x"
                        >
                          {item.label}
                        </Typography>
                      )}
                    </Box>
                  </Link>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Box flex="1" />
      <Box display="flex" flexDirection="column" gap="24px">
        {bottomLinks?.map((section, idx) => {
          return (
            <Box display="flex" flexDirection="column" gap="10px">
              {section?.sectionTitle && !isCollapsed ? (
                <Typography fontFamily="Poppins" fontSize="14px" fontWeight={500} color="#949494" lineHeight="14px">
                  {section?.sectionTitle}
                </Typography>
              ) : null}
              {section?.items?.map((item, idx) => {
                return (
                  <Link to={item.path}>
                    <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={500} lineHeight="14x">
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Divider />
      <Box display="flex" flexDirection="column" gap="24px">
        {bottomLinks?.map((section, idx) => {
          return (
            <Box display="flex" flexDirection="column" gap="10px">
              {section?.sectionTitle ? (
                <Typography fontFamily="Poppins" fontSize="14px" fontWeight={500} color="#949494" lineHeight="14px">
                  {section?.sectionTitle}
                </Typography>
              ) : null}
              {section?.items?.map((item, idx) => {
                return (
                  <Link to={item.path}>
                    <Typography color="black" fontSize="14px" fontWeight={500} lineHeight="14x">
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
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
        "& .MuiDrawer-paper": {
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
