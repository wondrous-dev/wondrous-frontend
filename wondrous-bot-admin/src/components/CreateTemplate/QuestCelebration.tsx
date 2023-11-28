import { Box, Typography } from "@mui/material";
import ConfettiComponent from "components/ConfettiComponent";
import CelebrationArtwork from "components/Shared/CelebrationArtwork";
import Modal from "components/Shared/Modal";
import { useEffect, useState } from "react";

const QuestCelebrationComponent = ({ duration = 2000, title = "Wooho! You created your first quest!", onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti(false);
    }, duration);
  }, []);

  return (
    <>
      <ConfettiComponent
        shouldShow={showConfetti}
        confettiProps={{
          numberOfPieces: showConfetti ? 200 : 0,
        }}
      />
      <Modal open maxWidth={422} onClose={onClose} title="">
        <Box display="flex" flexDirection="column" gap="24px" justifyContent="center" alignItems="center">
          <CelebrationArtwork />
          <Typography color={"black"} fontFamily="Poppins" fontSize="18px" fontWeight={600} lineHeight="32px">
            {title}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
export default QuestCelebrationComponent;
