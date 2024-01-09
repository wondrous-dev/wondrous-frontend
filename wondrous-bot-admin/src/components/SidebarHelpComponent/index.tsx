import { Box, ButtonBase, ClickAwayListener, Popper } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import GlobalContext from "utils/context/GlobalContext";
import { SidebarLabel, WorkspaceContainer } from "components/WorkspaceSwitch/styles";
import {
  ActiveTutorialIcon,
  BestPracticesIcon,
  InactiveTutorialIcon,
  ShareFeedbackIcon,
  SupportIcon,
  WrenchIcon,
  InfoIcon,
  FaqIcon,
} from "components/Icons/Sidebar";
import { ItemWrapper } from "./styles";
import { TourDataContext } from "utils/context";
import { useLocation } from "react-router-dom";
import { useTour } from "@reactour/tour";
import { useGlobalContext } from "utils/hooks";

interface GearIconProps {
  onClick?: () => void;
  Icon?: () => JSX.Element;
}

const ItemLinkElement = ({ children, path, onClick = () => {} }) => {
  if (path) {
    return (
      <a onClick={() => onClick?.()} href={path} target="_blank">
        {children}
      </a>
    );
  }
  return <ButtonBase onClick={onClick}>{children}</ButtonBase>;
};
const SidebarHelpComponent = ({ isCollapsed }) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { setShouldForceOpenTour } = useContext(TourDataContext);

  const ITEMS = [
    {
      label: "FAQ",
      path: "https://wonderverse.gitbook.io/wonder-communities/faq/questions",
      icon: FaqIcon,
    },
    {
      label: "Set Up",
      icon: WrenchIcon,
      path: "https://wonderverse.gitbook.io/wonder-communities/setting-up-wonderverse/video-tutorial",
    },
    {
      label: "Best Practices",
      icon: BestPracticesIcon,
    },
    {
      label: "Support",
      icon: SupportIcon,
      path: "https://wonderverse.gitbook.io/wonder-communities/recommendations/best-practices",
    },
    {
      label: "Share Feedback",
      icon: ShareFeedbackIcon,
      path: "https://wonderverse.canny.io/productfeedback",
    },
    {
      label: "Launch Tour",
      icon: InfoIcon,
      onClick: () => {
        return setShouldForceOpenTour((prev) => !prev);
      },
    },
  ];

  const handleClickAway = () => {
    if (isOpen) setIsOpen(false);
  };

  const togglePopper = () => setIsOpen((prev) => !prev);

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <Box>
        <Box
          display="flex"
          ref={ref}
          gap="8px"
          bgcolor={isOpen ? "#D7E9FF" : "transparent"}
          alignItems="center"
          borderRadius="6px"
          onClick={togglePopper}
          data-tour="tour-tutorial-link"
          padding="10px"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#EEE",
            },
          }}
        >
          {isOpen ? <ActiveTutorialIcon /> : <InactiveTutorialIcon />}

          <SidebarLabel $isCollapsed={isCollapsed}>Help</SidebarLabel>
        </Box>
        <Popper
          open={isOpen}
          placement="right"
          anchorEl={ref.current}
          sx={{
            zIndex: 999999,
          }}
        >
          <WorkspaceContainer
            bgcolor="white"
            border="1px solid #000000"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="12px"
            container
            direction={"column"}
            gap="8px"
            maxHeight="300px"
            flexWrap="nowrap"
            overflow="auto"
            padding="8px"
          >
            {ITEMS.map((item, idx) => {
              return (
                <ItemLinkElement
                  path={item.path}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                >
                  <ItemWrapper>
                    <item.icon />
                    <Label fontWeight={500} fontSize="15px" color="#1D1D1D">
                      {item.label}
                    </Label>
                  </ItemWrapper>
                </ItemLinkElement>
              );
            })}
          </WorkspaceContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default SidebarHelpComponent;
