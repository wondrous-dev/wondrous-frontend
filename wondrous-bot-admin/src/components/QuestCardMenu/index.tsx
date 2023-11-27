import { useMutation } from "@apollo/client";
import { VisibilityOffOutlined } from "@mui/icons-material";
import { ButtonBase, Grid, Popper, ClickAwayListener, Typography } from "@mui/material";
import ConfirmActionModal from "components/ConfirmActionModal";
import { ContextMenuButtonStyle } from "components/ContextMenu/styles";
import DeleteIcon from "components/Icons/Delete";
import { EditIcon, PublishIcon, UnpublishIcon } from "components/Icons/QuestCardMenu";
import { ButtonIconWrapper } from "components/Shared/styles";
import { DELETE_QUEST, ACTIVATE_QUEST, DEACTIVATE_QUEST } from "graphql/mutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAlerts from "utils/hooks";

const QuestCardMenu = ({ quest, anchorEl, setAnchorEl }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [confirmModalData, setConfirmModalData] = useState(null);

  const navigate = useNavigate();

  const [deleteQuest] = useMutation(DELETE_QUEST, {
    onCompleted: () => {
      setSnackbarAlertMessage("Quest deleted successfully");
      setSnackbarAlertOpen(true);
      setAnchorEl(null);
      setConfirmModalData(null);
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error deleting quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  const [deactivateQuest] = useMutation(DEACTIVATE_QUEST, {
    onCompleted: () => {
      setSnackbarAlertMessage("Quest unpublished successfully");
      setSnackbarAlertOpen(true);
      setAnchorEl(null);
      setConfirmModalData(null);
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error unpublishing quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  const [activateQuest] = useMutation(ACTIVATE_QUEST, {
    onCompleted: () => {
      setSnackbarAlertMessage("Quest published successfully");
      setSnackbarAlertOpen(true);
      setAnchorEl(null);
      setConfirmModalData(null);
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error publishing quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  const onReset = () => setAnchorEl(null);

  const ALL_ACTIONS = [
    {
      label: "Edit quest",
      onClick: () => navigate(`/quests/${quest.id}?edit=true`),
      show: true,
      Icon: () => (
        <ButtonIconWrapper width="24px" height="24px" bgcolor="#E4E4E4">
          <EditIcon />
        </ButtonIconWrapper>
      ),
      // Icon:
    },
    {
      label: "Delete quest",
      Icon: () => (
        <ButtonIconWrapper width="24px" height="24px" bgcolor="#E4E4E4">
          <DeleteIcon />
        </ButtonIconWrapper>
      ),
      onClick: () => {
        setConfirmModalData({
          title: "Delete Quest",
          body: "Are you sure you want to delete this quest?",
          onConfirm: () => {
            deleteQuest({ variables: { questId: quest.id } });
          },
          onClose: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          onCancel: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          cancelButtonTitle: "Cancel",
          confirmButtonTitle: "Delete",
        });
      },
      show: true,
    },
    {
      label: "Unpublish quest",
      Icon: () => (
        <ButtonIconWrapper width="24px" height="24px" bgcolor="#E4E4E4">
          <UnpublishIcon />
        </ButtonIconWrapper>
      ),
      onClick: () => {
        setConfirmModalData({
          title: "Unpublish Quest",
          body: "Are you sure you want to unpublish this quest?",
          onConfirm: () => {
            deactivateQuest({ variables: { questId: quest.id } });
          },
          onClose: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          onCancel: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          cancelButtonTitle: "Cancel",
          confirmButtonTitle: "Unpublish",
        });
      },
      show: quest?.status === "open",
    },
    {
      label: "Publish quest",
      Icon: () => (
        <ButtonIconWrapper width="24px" height="24px" bgcolor="#E4E4E4">
          <PublishIcon />
        </ButtonIconWrapper>
      ),
      onClick: () => {
        setConfirmModalData({
          title: "Publish Quest",
          body: "Are you sure you want to publish this quest?",
          onConfirm: () => {
            activateQuest({ variables: { questId: quest.id } });
          },
          onClose: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          onCancel: () => {
            setAnchorEl(null);
            setConfirmModalData(null);
          },
          cancelButtonTitle: "Cancel",
          confirmButtonTitle: "Publish",
        });
      },
      show: quest?.status === "inactive",
    },
  ];
  const ACTIONS = ALL_ACTIONS.filter((action) => action.show);
  return (
    <>
      <ConfirmActionModal isOpen={!!confirmModalData} {...confirmModalData} />
      <ClickAwayListener onClickAway={onReset}>
        <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute" }}>
          <Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom">
            <Grid
              bgcolor="white"
              zIndex="100"
              border="1px solid #000000"
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
              borderRadius="6px"
              container
              width="100%"
              direction={"column"}
              gap="10px"
              maxHeight="500px"
              overflow="hidden"
              flexWrap="nowrap"
              padding="6px"
            >
              {ACTIONS.map((action) => (
                <ContextMenuButtonStyle
                  onClick={() => action.onClick()}
                  key={action.label}
                  sx={{
                    "&:hover": {
                      [`.${ButtonIconWrapper.styledComponentId}`]: {
                        backgroundColor: "#F1F1F1",
                      },
                    },
                  }}
                >
                  {action.Icon()}
                  <Typography
                    fontFamily="Poppins"
                    fontSize="14px"
                    fontWeight={500}
                    color="black"
                    sx={{
                      wordBreak: "no-break",
                    }}
                  >
                    {action.label}
                  </Typography>
                </ContextMenuButtonStyle>
              ))}
            </Grid>
          </Popper>
        </div>
      </ClickAwayListener>
    </>
  );
};

export default QuestCardMenu;
