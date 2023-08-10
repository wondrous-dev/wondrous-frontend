import Modal from "components/Shared/Modal";
import { ConnectWonderbotDescription, ConnectWonderbotImg, ConnectWonderbotText } from "./styles";
import AddDiscordImg from "assets/addDiscord.svg";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Box } from "@mui/material";
import ConnectBotComponent from "components/ConnectBotComponent";

export const AddBotModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} noHeader title="" maxWidth={600}>
      <Box display="flex" flexDirection={"column"} justifyContent={"center"}>
        <ConnectWonderbotText>Connect the WonderBot</ConnectWonderbotText>
        <ConnectWonderbotDescription>
          The party doesn't start until you add WonderBot to your server! Connect WonderBot to your server to start
          sending out quests.{" "}
        </ConnectWonderbotDescription>
        <ConnectBotComponent cardBgColor={"#F7F7F7"} />
        <SharedSecondaryButton
          style={{
            border: "none",
            color: "rgba(109, 109, 109, 1)",
            outline: "0",
          }}
          $reverse
          onClick={onClose}
        >
          Skip for now
        </SharedSecondaryButton>
      </Box>
    </Modal>
  );
};
