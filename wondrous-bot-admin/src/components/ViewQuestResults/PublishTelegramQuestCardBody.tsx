import { Box } from "@mui/material";
import { useState } from "react";
import { Label } from "components/CreateTemplate/styles";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { PUSH_QUEST_DISCORD_NOTFICATION, PUSH_QUEST_TELEGRAM_NOTFICATION } from "graphql/mutations/discord";
import { useMutation } from "@apollo/client";
import useAlerts from "utils/hooks";
import { PublishQuestModal } from "./PublishQuestCardBody";

const PublishTelegramQuestcard = ({ telegramConfig, quest, orgId }) => {
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(`${quest?.title} is now available! Check it out here and make a submission`);
  const [publishQuest] = useMutation(PUSH_QUEST_TELEGRAM_NOTFICATION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertAnchorOrigin({
        vertical: "top",
        horizontal: "center",
      });
      setOpenPublishModal(false);
    },
  });

  return (
    <>
      <Modal open={openPublishModal} onClose={() => setOpenPublishModal(false)} title="Publish quest to Telegram ">
        <PublishQuestModal
          onClose={() => setOpenPublishModal(false)}
          channelName={telegramConfig?.chatInfo?.title}
          setMessage={setMessage}
          customLabel={`Are you sure you want to publish this quest in ${telegramConfig?.chatInfo?.title}?`}
          message={message}
          handlePublish={() => {
            publishQuest({
              variables: {
                questId: quest.id,
                orgId,
                message,
              },
            });
          }}
        />
      </Modal>
      {errors?.discordChannel && (
        <ErrorText
          style={{
            marginTop: "-4px",
            fontSize: "12px",
          }}
        >
          {errors?.discordChannel}
        </ErrorText>
      )}
      <Box display="flex" width={"100%"} alignItems="center">
        <Label>
          Publish in <u>{telegramConfig?.chatInfo?.title}</u>
        </Label>
        <Box flex={1} />
        <SharedSecondaryButton disabled={!telegramConfig?.chatId} onClick={() => setOpenPublishModal(true)}>
          Publish
        </SharedSecondaryButton>
      </Box>
    </>
  );
};

export default PublishTelegramQuestcard;
