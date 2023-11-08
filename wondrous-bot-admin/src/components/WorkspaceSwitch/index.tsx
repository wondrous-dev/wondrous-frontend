import { Box, Button, ButtonBase, ClickAwayListener, Divider, Grid, Popper } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import SettingsIcon, { OutlinedSettingsIcon } from "components/Icons/SettingsIcon";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { forwardRef, ForwardRefRenderFunction, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import GlobalContext from "utils/context/GlobalContext";
import { WorkspaceContainer, WorkspaceImageWrapper, WorkspaceWrapper } from "./styles";
import { TutorialButton, TutorialLink } from "components/Navbar/styles";
import AddImage from "components/Icons/Add.svg";
import { WorkspaceDAOIcon } from "components/Icons/DAOIcon";

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

const WorkspaceSwitch = () => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { userOrgs, activeOrg, setActiveOrg } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleClickAway = () => {
    if (isOpen) setIsOpen(false);
  };
  const onOrgClick = (org) => {
    setActiveOrg(org);
    navigate("/");
    handleClickAway();
  };

  const togglePopper = () => setIsOpen((prev) => !prev);
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <Box
        flex={{
          xs: 1,
          md: "unset",
        }}
        display={{
          xs: "flex",
          md: "block",
        }}
        justifyContent="flex-end"
        alignItems="center"
        marginRight={{
          xs: "10px",
          md: "unset",
        }}
      >
        <Box alignItems={"center"} display="flex" gap="10px">
          <TutorialLink href="https://wonderverse.gitbook.io/wonder-communities/" target="_blank">
            <TutorialButton>?</TutorialButton>
          </TutorialLink>
          <GearButton ref={ref} onClick={togglePopper} />
        </Box>
        <Popper
          open={isOpen}
          placement="bottom-start"
          anchorEl={ref.current}
          sx={{
            zIndex: 1000,
          }}
        >
          <WorkspaceContainer
            bgcolor="white"
            border="1px solid #000000"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
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
                    <WorkspaceImageWrapper>
                    {org?.profilePicture ? (
                      <OrgProfilePicture
                        profilePicture={org?.profilePicture}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <WorkspaceDAOIcon />
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
            <WorkspaceWrapper onClick={() => navigate("/onboarding/welcome")}>
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
            <ButtonBase
              onClick={(e) => {
                e.stopPropagation();
                handleClickAway();
                navigate("/settings");
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "flex-start",
                marginTop: "4px",
                padding: "3px",
                borderRadius: "30px",
                "&:hover": {
                  background: "#e3e3e3",
                },
              }}
            >
              <GearButton Icon={OutlinedSettingsIcon} />
              <Label color="#1D1D1D" fontWeight={500} fontSize="15px">
                Settings
              </Label>
            </ButtonBase>
          </WorkspaceContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default WorkspaceSwitch;
