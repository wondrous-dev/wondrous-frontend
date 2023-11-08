import { Box, Typography } from "@mui/material";
import ConfettiComponent from "components/ConfettiComponent";
import CelebrationArtwork from "components/Shared/CelebrationArtwork";
import Modal from "components/Shared/Modal";

const QuestCelebrationComponent = () => {
  return (
    <>
      <ConfettiComponent shouldShow={true} />
      <Modal open noHeader maxWidth={422} onClose={() => {}} title="">
        <Box display="flex" flexDirection="column" gap="24px" justifyContent="center" alignItems="center">
          <CelebrationArtwork />
          <Typography color={"black"} fontFamily="Poppins" fontSize="18px" fontWeight={600} lineHeight="32px">
            Wooho! You created your first quest!
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
export default QuestCelebrationComponent;
