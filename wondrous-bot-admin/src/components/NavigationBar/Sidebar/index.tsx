import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import { DrawerComponent } from "../shared";

const drawerWidth = 240;

const collapsedDrawerWidth = 64;

const SidebarComponent = ({ links }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <Drawer
        variant="persistent"
        open
        data-tour="sidebar-drawer"
        anchor="left"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          zIndex: 9999,
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
        <DrawerComponent links={links} isCollapsed={isCollapsed} toggleDrawer={() => setIsCollapsed((prev) => !prev)} />
      </Drawer>
    </>
  );
};

export default SidebarComponent;
