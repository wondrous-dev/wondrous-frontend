import { useMutation } from "@apollo/client";
import ConfirmActionModal from "components/ConfirmActionModal";
import { ButtonIconWrapper } from "components/Shared/styles";
import { DELETE_QUEST } from "graphql/mutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "components/Icons/Delete";

import useAlerts from "utils/hooks";

const DeleteQuestButton = ({ questId }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      <ButtonIconWrapper onClick={() => setIsOpen(true)}>
        <DeleteIcon />
      </ButtonIconWrapper>
    </>
  );
};

export default DeleteQuestButton;
