import { Box, Button, ButtonBase, ClickAwayListener, Divider, Grid, Popper } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import SettingsIcon from "components/Icons/SettingsIcon";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { forwardRef, ForwardRefRenderFunction, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
import GlobalContext from "utils/context/GlobalContext";
import { WorkspaceWrapper } from "./styles";
import { TutorialButton, TutorialLink } from "components/Navbar/styles";
import AddImage from "components/Icons/Add.svg";

interface WrenchButtonProps {
  onClick?: () => void;
}

const WrenchButton = forwardRef<HTMLButtonElement, WrenchButtonProps>(({ onClick = (e) => {} }, ref) => (
  <ButtonBase
    ref={ref}
    onClick={onClick}
    type="button"
    sx={{
      borderRadius: "140px",
      backgroundColor: "#BAACFA",
      width: "36px",
      height: "36px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <SettingsIcon />
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
        <Box alignItems={"center"} display="flex">
          <TutorialLink href="https://wonderverse.gitbook.io/wonder-communities/" target="_blank">
            <TutorialButton>?</TutorialButton>
          </TutorialLink>
          <WrenchButton ref={ref} onClick={togglePopper} />
        </Box>
        <Popper
          open={isOpen}
          placement="bottom-start"
          anchorEl={ref.current}
          sx={{
            zIndex: 1000,
          }}
        >
          <Grid
            bgcolor="white"
            border="1px solid #000000"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="6px"
            container
            width="300px"
            direction={"column"}
            gap="10px"
            padding="14px"
          >
            <Label>Workspaces</Label>
            {userOrgs?.map((org, idx) => {
              const isActive = org.id === activeOrg?.id;
              return (
                <WorkspaceWrapper onClick={() => onOrgClick(org)} key={org.id}>
                  <Box display="flex" gap="10px" alignItems="center">
                    <OrgProfilePicture
                      profilePicture={org?.profilePicture}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                      }}
                    />
                    <Label color="#1D1D1D">{org.name}</Label>
                  </Box>
                  {isActive && (
                    <CheckCircleOutlineOutlinedIcon
                      sx={{
                        color: "#F8AFDB",
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
                    width: "36px",
                    height: "36px",
                  }}
                  src={AddImage}
                />
                <Label color="#1D1D1D">Add new</Label>
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
                padding: "10px 4px",
              }}
            >
              <WrenchButton />
              <Label color="#1D1D1D">Settings</Label>
            </ButtonBase>
          </Grid>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default WorkspaceSwitch;
