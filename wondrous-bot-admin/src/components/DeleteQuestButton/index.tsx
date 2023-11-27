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
import ContextMenu from "components/ContextMenu";
import { ContextMenuButtonStyle } from "components/ContextMenu/styles";

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
      <ContextMenu
        renderButtons={({ setAnchorEl }) => (
          <ContextMenuButtonStyle
            onClick={() => {
              setAnchorEl(null);
              setIsOpen(true);
            }}
          >
            <ButtonIconWrapper bgcolor="#CE414D" height="24px" width="24px">
              <DeleteIcon stroke="white" />
            </ButtonIconWrapper>
            <Typography
              fontFamily="Poppins"
              fontSize="14px"
              fontWeight={500}
              color="#CE414D"
              sx={{
                wordBreak: "break-word",
              }}
            >
              Delete Quest
            </Typography>
          </ContextMenuButtonStyle>
        )}
      />

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
    </>
  );
};

export default DeleteQuestButton;
