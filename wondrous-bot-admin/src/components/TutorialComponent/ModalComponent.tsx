import { Grid, Box } from "@mui/material";
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { SkipButton } from "./styles";
import useSkipTour from "./shared/useSkipTour";

const ModalComponent = ({
  isModalOpen,
  onClose,
  imgSrc,
  children,
  onStart,
  onSkip = null,
  startButtonLabel = "Start Onboarding",
}) => {
  const { skipTour } = useSkipTour();

  const handleSkip = () => {
    skipTour();
    onClose();
    onSkip?.();
  };

  return (
    <Modal
      open={isModalOpen}
      noHeader
      onClose={onClose}
      maxWidth={470}
      footerCenter
      footerRight={
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          gap="12px"
          flexDirection={{
            xs: "column",
            md: "row",
          }}
        >
          <SkipButton onClick={handleSkip}>Skip Tour</SkipButton>
          <SharedSecondaryButton onClick={onStart}>{startButtonLabel}</SharedSecondaryButton>
        </Box>
      }
    >
      <Grid display="flex" flexDirection="column" gap="24px" alignItems="center" justifyContent="center" width="100%">
        <Box
          width="100%"
          height="300px"
          borderRadius="12px"
          sx={{
            background: `url(${imgSrc}), lightgray -55.176px -119.913px / 143.152% 208.628% no-repeat`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#D5AEFD",
          }}
        />
        {children}
      </Grid>
    </Modal>
  );
};

export default ModalComponent;
