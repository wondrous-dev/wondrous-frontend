import { useMutation } from "@apollo/client";
import { ButtonBase, Grid, Popper, ClickAwayListener, Typography } from "@mui/material";
import ConfirmActionModal from "components/ConfirmActionModal";
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
      setSnackbarAlertMessage("Quest deactivated successfully");
      setSnackbarAlertOpen(true);
      setAnchorEl(null);
      setConfirmModalData(null);
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error deactivating quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  const [activateQuest] = useMutation(ACTIVATE_QUEST, {
    onCompleted: () => {
      setSnackbarAlertMessage("Quest deactivated successfully");
      setSnackbarAlertOpen(true);
      setAnchorEl(null);
      setConfirmModalData(null);
    },
    onError: (error) => {
      setSnackbarAlertMessage("Error deactivating quest");
      setSnackbarAlertOpen(true);
    },
    refetchQueries: ["getQuestsForOrg", "getOrgQuestStats"],
  });

  const onReset = () => setAnchorEl(null);

  const ALL_ACTIONS = [
    {
      label: "Edit",
      onClick: () => navigate(`/quests/${quest.id}?edit=true`),
      show: true
    },
    {
      label: "Delete",
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
      show: true
    },
    {
      label: "Deactivate",
      onClick: () => {
        setConfirmModalData({
          title: "Deactivate Quest",
          body: "Are you sure you want to deactivate this quest?",
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
          confirmButtonTitle: "Deactivate",
        });
      },
      show: quest?.status === "open",
    },
    {
      label: "Activate",
      onClick: () => {
        setConfirmModalData({
          title: "Activate Quest",
          body: "Are you sure you want to activate this quest?",
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
          confirmButtonTitle: "Activate",
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
        <div onClick={(e) => e.stopPropagation()} style={{position: 'absolute'}}>
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
              {ACTIONS.map((action) => (
                <ButtonBase
                  onClick={() => action.onClick()}
                  key={action.label}
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
                  <Typography fontFamily="Poppins" fontSize="14px" fontWeight={500} color="black">
                    {action.label}
                  </Typography>
                </ButtonBase>
              ))}
            </Grid>
          </Popper>
        </div>
      </ClickAwayListener>
    </>
  );
};

export default QuestCardMenu;
