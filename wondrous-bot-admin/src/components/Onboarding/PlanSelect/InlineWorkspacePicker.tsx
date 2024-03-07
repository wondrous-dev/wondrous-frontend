import { Box, ClickAwayListener, Popper, Typography } from "@mui/material";
import { useGlobalContext } from "utils/hooks";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRef, useState } from "react";
import { WorkspaceDAOIcon } from "components/Icons/DAOIcon";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { WorkspaceContainer, WorkspaceWrapper, WorkspaceImageWrapper } from "components/WorkspaceSwitch/styles";
import { Label } from "components/CreateTemplate/styles";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import AddImage from "components/Icons/Add.svg";

const InlineWorkspacePicker = () => {
  const { activeOrg, userOrgs, setActiveOrg } = useGlobalContext();

  const anchorEl = useRef(null);
  const hasMoreThanOneOrg = userOrgs.length > 1;

  const [isOpen, setIsOpen] = useState(false);

  const onClickAway = () => (isOpen ? setIsOpen(false) : null);

  const onOrgClick = (org) => {
    setActiveOrg(org);
    onClickAway();
  };

  const navigate = useNavigate();
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box
        display="flex"
        gap="4px"
        ref={anchorEl}
        onClick={() => setIsOpen((prev) => !prev)}
        justifyContent="center"
        alignItems="center"
        sx={{
          borderBottom: "1px solid transparent",
          pointerEvents: hasMoreThanOneOrg ? "auto" : "none",
          "&:hover": {
            cursor: "pointer",
            borderColor: "white",
          },
        }}
      >
        <Typography
          fontSize={{
            xs: "28px",
            sm: "32px",
          }}
          whiteSpace="nowrap"
          fontWeight={600}
          color="white"
        >
          {activeOrg?.name}
        </Typography>
        {hasMoreThanOneOrg && (
          <KeyboardArrowDownIcon
            sx={{
              fontSize: {
                xs: "28px",
                sm: "32px",
              },
              color: "white",
            }}
          />
        )}
        <Popper
          open={isOpen}
          placement="bottom-start"
          anchorEl={anchorEl.current}
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
            maxHeight="400px"
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
          </WorkspaceContainer>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default InlineWorkspacePicker;
