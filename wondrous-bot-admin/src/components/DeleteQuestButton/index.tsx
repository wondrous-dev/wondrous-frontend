import { useMutation } from "@apollo/client";
import ConfirmActionModal from "components/ConfirmActionModal";
import { ButtonIconWrapper } from "components/Shared/styles";
import { DELETE_QUEST } from "graphql/mutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "components/Icons/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import useAlerts from "utils/hooks";
import { ButtonBase, ClickAwayListener, Grid, Popper, Typography } from "@mui/material";

const DeleteQuestButton = ({ questId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const navigate = useNavigate();
  const [deleteQuest] = useMutation(DELETE_QUEST, {
    onCompleted: () => {
      setSnackbarAlertMessage("Quest deleted successfully");
      setSnackbarAlertOpen(true);
      setIsOpen(false);
      navigate("/quests");
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error deleting quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  return (
    <>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <div>
          <ButtonBase
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
              padding: "4px",
              transition: "background 0.1s ease-in-out",
              ":hover": {
                background: "#E8E8E8",
              },
            }}
          >
            <MoreVertIcon
              sx={{
                color: "black",
              }}
            />
          </ButtonBase>

          <Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom">
            <Grid
              bgcolor="white"
              zIndex="100"
              border="1px solid #000000"
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
              borderRadius="6px"
              container
              width="150px"
              direction={"column"}
              gap="10px"
              maxHeight="500px"
              overflow="scroll"
              flexWrap="nowrap"
              padding="14px"
            >
              <ButtonBase
                onClick={() => setIsOpen(true)}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  ":hover": {
                    background: "#C1B6F6",
                  },
                }}
              >
                <Typography fontFamily="Poppins" fontSize="14px" fontWeight={500} color="#ee4852">
                  Delete Quest
                </Typography>
              </ButtonBase>
            </Grid>
          </Popper>
        </div>
      </ClickAwayListener>

      <ConfirmActionModal
        isOpen={isOpen}
        title="Delete Quest"
        body="Are you sure you want to delete this quest?"
        onConfirm={() => {
          deleteQuest({ variables: { questId } });
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Delete"
      />

      {/* <ButtonIconWrapper onClick={() => setIsOpen(true)}>
        <DeleteIcon />
      </ButtonIconWrapper> */}
    </>
  );
};

export default DeleteQuestButton;
