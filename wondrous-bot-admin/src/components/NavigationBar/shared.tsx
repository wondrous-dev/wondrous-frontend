import {
  ActiveSettingsIcon,
  InactiveSettingsIcon,
  InactiveTutorialIcon,
  ActiveTutorialIcon,
} from "components/Icons/Sidebar";
import { Link, useLocation } from "react-router-dom";
import { DrawerContainer, ImageDefault } from "./styles";
import { Box, ButtonBase, useMediaQuery } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import WorkspaceSwitch from "components/WorkspaceSwitch";
import { SidebarLabel } from "components/WorkspaceSwitch/styles";
import { checkActive } from "./utils";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";

export const LinkItem = ({ item, children, ...props }) =>
  item.isExternalPath ? (
    <a href={item.path} target="__blank" rel="noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <Link to={item.path} {...props}>
      {children}
    </Link>
  );

export const BOTTOM_LINKS = [
  {
    label: "Settings",
    path: "/settings",
    activeIcon: ActiveSettingsIcon,
    inactiveIcon: InactiveSettingsIcon,
  },
  {
    label: "Tutorial",
    path: "https://wonderverse.gitbook.io/wonder-communities",
    isExternalPath: true,
    inactiveIcon: InactiveTutorialIcon,
    activeIcon: ActiveTutorialIcon,
    props: {
      "data-tour": "tour-tutorial-link",
    },
  },
];

const NavigationItem = ({ item, isCollapsed, toggleDrawer }) => {
  const location = useLocation();

  const isActive = checkActive(item.path, location, item.partialMatch);

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const closeDrawerOnRedirect = (e) => {
    e.stopPropagation();
    toggleDrawer();
  };

  const linkProps = isMobile ? { onClick: closeDrawerOnRedirect } : {};
  const itemProps = item.props || {};
  return (
    <LinkItem item={item} {...linkProps} {...itemProps}>
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

        <SidebarLabel $isCollapsed={isCollapsed}>{item.label}</SidebarLabel>
      </Box>
    </LinkItem>
  );
};

const LinksWrapper = ({ links, isCollapsed, toggleDrawer }) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  return links?.map((section, idx) => {
    if (section.isInactive) return null;
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={{
          xs: "4px",
          md: "10px",
        }}
        padding="10px"
        key={`section-${idx}`}
      >
        {section?.sectionTitle ? (
          <SidebarLabel color="#949494" $isCollapsed={isCollapsed} sx={{ padding: "0px 10px" }}>
            {section?.sectionTitle}
          </SidebarLabel>
        ) : null}
        {section?.items?.map((item) => {
          if (item.isInactive) return null;
          return (
            <NavigationItem
              item={item}
              isCollapsed={isCollapsed}
              key={`item-${item.label}`}
              toggleDrawer={toggleDrawer}
            />
          );
        })}
        {idx !== links.length - 1 && isMobile ? <Divider style={{ marginTop: "3px" }} /> : null}
      </Box>
    );
  });
};

export const DrawerComponent = ({ isCollapsed, toggleDrawer, links }) => (
  <DrawerContainer data-tour="home-page-guide">
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
        onClick={toggleDrawer}
        sx={{
          position: isCollapsed ? "absolute" : "relative",
          display: {
            xs: "none",
            md: "flex",
          },
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid black",
          borderRadius: "100px",
          background: "white",
          right: isCollapsed ? "-25%" : "0",
          outline: "none",
          "&:focus-visible": {
            outline: "none",
          },
          "&:hover": {
            background: "#AF9EFF",
          },
        }}
      >
        <ChevronLeft
          sx={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.2s ease-in-out",
          }}
        />
      </ButtonBase>
    </Box>
    <Box display="flex" flexDirection="column" flex="1">
      <LinksWrapper links={links} isCollapsed={isCollapsed} toggleDrawer={toggleDrawer} />
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      padding="0px 10px"
      gap={{
        xs: "4px",
        md: "10px",
      }}
    >
      {BOTTOM_LINKS.map((link, idx) => {
        return (
          <NavigationItem
            item={link}
            isCollapsed={isCollapsed}
            key={`bottom-link-${idx}`}
            toggleDrawer={toggleDrawer}
          />
        );
      })}
    </Box>
    <WorkspaceSwitch isCollapsed={isCollapsed} />
  </DrawerContainer>
);
