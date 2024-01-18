import { Box, ButtonBase, ClickAwayListener, Divider, Popper } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import SettingsIcon from "components/Icons/SettingsIcon";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { forwardRef, useContext, useState } from "react";
import { useNavigate } from "react-router";
import GlobalContext from "utils/context/GlobalContext";
import { SidebarLabel, WorkspaceContainer, WorkspaceImageWrapper, WorkspaceWrapper } from "./styles";
import AddImage from "components/Icons/Add.svg";
import { WorkspaceDAOIcon } from "components/Icons/DAOIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { logout } from "components/Auth";
import { LogoutRounded } from "@mui/icons-material";
import { ButtonIconWrapper } from "components/Shared/styles";

interface GearIconProps {
  onClick?: () => void;
  Icon?: () => JSX.Element;
}

const GearButton = forwardRef<HTMLButtonElement, GearIconProps>(({ onClick = (e) => {}, Icon = SettingsIcon }, ref) => (
  <ButtonBase
    ref={ref}
    onClick={onClick}
    type="button"
    sx={{
      borderRadius: "140px",
      backgroundColor: "#BAACFA",
      width: "30px",
      height: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <Icon />
  </ButtonBase>
));

const WorkspaceSwitch = ({ isCollapsed = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { userOrgs, activeOrg, setActiveOrg } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleClickAway = () => {
    if (anchorEl) setAnchorEl(null);
  };
  const onOrgClick = (org) => {
    setActiveOrg(org);
    navigate("/");
    handleClickAway();
  };

  const togglePopper = (e) => {
    return setAnchorEl((prev) => (prev ? null : e.currentTarget));
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <Box>
        <Divider />

        <Box padding="10px">
          <Box
            display="flex"
            gap="8px"
            bgcolor={anchorEl ? "#D7E9FF" : "transparent"}
            alignItems="center"
            borderRadius="6px"
            onClick={isCollapsed ? (e) => togglePopper(e) : () => {}}
            justifyContent="center"
            padding="10px"
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: anchorEl ? "#D7E9FF" : "#EEE",
              },
            }}
          >
            <WorkspaceImageWrapper height={isCollapsed ? "auto" : "100%"} width={isCollapsed ? "auto" : "100%"}>
              {activeOrg?.profilePicture ? (
                <OrgProfilePicture
                  profilePicture={activeOrg?.profilePicture}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <WorkspaceDAOIcon width="100%" height="100%" />
              )}
            </WorkspaceImageWrapper>

            <SidebarLabel $isCollapsed={isCollapsed}>{activeOrg?.name}</SidebarLabel>
            {isCollapsed ? null : (
              <Box flex="1" display="flex" justifyContent="flex-end" alignItems="center">
                <ButtonBase
                  onClick={togglePopper}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    height: "32px",
                    background: anchorEl ? "white" : "#E7E7E7",
                    border: "1px solid transparent",
                    transition: "all 0.1s ease-in-out",
                    ":hover": {
                      borderColor: "#000000",
                      background: "white",
                    },
                  }}
                >
                  <MoreVertIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </ButtonBase>
              </Box>
            )}
          </Box>
        </Box>
        <Popper
          open={!!anchorEl}
          placement="bottom-start"
          anchorEl={anchorEl}
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
            padding="14px"
          >
            <Label color="#4D4D4D" fontWeight="600" fontSize="13px">
              Workspaces
            </Label>
            {userOrgs?.map((org, idx) => {
              const isActive = org.id === activeOrg?.id;
              return (
                <WorkspaceWrapper onClick={() => onOrgClick(org)} key={org.id}>
                  <Box display="flex" gap="10px" alignItems="center">
                    <WorkspaceImageWrapper borderRadius="6px" height="30px" width="30px">
                      {org?.profilePicture ? (
                        <OrgProfilePicture
                          profilePicture={org?.profilePicture}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        <WorkspaceDAOIcon width="100%" height="100%" />
                      )}
                    </WorkspaceImageWrapper>
                    <Label fontWeight={500} fontSize="15px" color="#1D1D1D">
                      {org.name}
                    </Label>
                  </Box>
                  {isActive && (
                    <CheckCircleOutlineOutlinedIcon
                      sx={{
                        color: "#2A8D5C",
                      }}
                    />
                  )}
                </WorkspaceWrapper>
              );
            })}
            <WorkspaceWrapper onClick={() => navigate("/onboarding/welcome?ref=workspace")}>
              <Box display="flex" gap="10px" alignItems="center">
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                  src={AddImage}
                />
                <Label color="#1D1D1D" fontWeight={500} fontSize="15px">
                  Add new
                </Label>
              </Box>
            </WorkspaceWrapper>
            <Divider />
            <WorkspaceWrapper onClick={() => logout()}>
              <Box display="flex" gap="10px" alignItems="center">
                <ButtonIconWrapper>
                  <LogoutRounded
                    sx={{
                      color: "black",
                      transform: "rotate(180deg)",
                      width: "16px",
                      height: "16px",
                    }}
                  />
                </ButtonIconWrapper>
                <Label color="#1D1D1D" fontWeight={500} fontSize="15px">
                  Log Out
                </Label>
              </Box>
            </WorkspaceWrapper>
          </WorkspaceContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default WorkspaceSwitch;
