import Modal from "components/Shared/Modal";
import { ConnectWonderbotDescription, ConnectWonderbotImg, ConnectWonderbotText } from "./styles";
import AddDiscordImg from "assets/addDiscord.svg";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Box } from "@mui/material";
import { getDiscordBotOauthURL } from "components/ConnectDiscord/ConnectDiscordButton";

export const AddBotModal = ({ open, onClose, orgId }) => {
  const oauthUrl = getDiscordBotOauthURL({ orgId });

  const handleClick = async () => {
    window.location.href = oauthUrl;
  };
  return (
    <Modal open={open} onClose={onClose} noHeader title="" maxWidth={600}>
      <Box display="flex" flexDirection={"column"} justifyContent={"center"}>
        <ConnectWonderbotText>Connect the WonderBot</ConnectWonderbotText>
        <ConnectWonderbotDescription>
          Connect WonderBot to your Discord server for free. Trusted by top servers with no risk to your community.
        </ConnectWonderbotDescription>
        <ConnectWonderbotImg src={AddDiscordImg} />
        <SharedSecondaryButton onClick={handleClick}>Connect Bot</SharedSecondaryButton>
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
