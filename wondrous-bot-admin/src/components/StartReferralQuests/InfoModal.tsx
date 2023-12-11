import { Box } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import { getDiscordUrl } from "utils/discord";

const InfoModal = ({
  isOpen,
  onStartQuest,
  onClose,
  isConnectionLoading,
  showConnect,
  showJoinDiscord,
  showStartQuest,
  handleJoinDiscord,
  handleOnConnect,
}) => {
  return (
    <>
      <Modal open={isOpen} onClose={onClose} noHeader maxWidth={600}>
        <Box display="flex" gap="24px" justifyContent="center" alignItems="center" flexDirection="column">
          {showConnect ? (
            <>
              <Label>Please connect Discord in order to start this quest</Label>
              <SharedSecondaryButton onClick={handleOnConnect}>
                {isConnectionLoading ? <Spinner /> : "Connect Discord"}
              </SharedSecondaryButton>
            </>
          ) : null}
          {showJoinDiscord ? (
            <>
              <Label>You need to be a member of Discord server to start this quest</Label>
              <SharedSecondaryButton onClick={handleJoinDiscord}>
                {isConnectionLoading ? <Spinner /> : "Join Discord"}
              </SharedSecondaryButton>
            </>
          ) : null}
          {showStartQuest ? (
            <>
              <Label>Ready to start quest!</Label>
              <SharedSecondaryButton onClick={onStartQuest}>Start Quest</SharedSecondaryButton>
            </>
          ) : null}
        </Box>
      </Modal>
    </>
  );
};

export default InfoModal;
