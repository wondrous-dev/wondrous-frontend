import Hexagon from "components/Icons/Hexagon";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import { getDiscordUrl } from "utils/discord";
import CheckIcon from "components/Icons/Check";
import { useMemo } from "react";

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
  label = "Start Quest",
}) => {
  const STEPS_CONFIG = [
    {
      label: "Connect Discord",
      checked: !showConnect,
    },
    {
      label: "Join Discord",
      checked: !showJoinDiscord && showStartQuest,
    },
    {
      label: "Start Quest",
    },
  ];

  const handleOnClick = () => {
    if (showConnect) {
      handleOnConnect();
    }
    if (showJoinDiscord) {
      handleJoinDiscord();
    }
    if (showStartQuest) {
      onStartQuest();
    }
  };

  const buttonTitle = useMemo(() => {
    if (showConnect) {
      return "Connect Discord";
    }
    if (showJoinDiscord) {
      return "Join Discord";
    }
    return "Start Quest";
  }, [showConnect, showJoinDiscord, showStartQuest]);

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title={null} maxWidth={792} noHeader>
        <Grid
          display="flex"
          gap="24px"
          sx={{
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" gap="24px">
            <Box display="flex" flexDirection="column" gap="14px" height="100%" justifyContent="center">
              <Typography
                color="#2A8D5C"
                fontWeight={700}
                fontFamily="Poppins"
                fontSize={{
                  xs: "20px",
                  sm: "24px",
                }}
                lineHeight="33px"
              >
                {label}
              </Typography>
              <Typography
                color="#5E5E5E"
                fontFamily="Poppins"
                fontSize={{
                  xs: "12px",
                  sm: "15px",
                }}
                lineHeight="24px"
                fontWeight={500}
              >
                In order to start this quest make sure you have connected your Discord account and joined the Discord
              </Typography>
              <Box display="flex" flexDirection="column" gap="8px">
                <Label
                  fontSize={{
                    xs: "12px",
                    sm: "15px",
                  }}
                  fontWeight={600}
                >
                  How to:
                </Label>
                {STEPS_CONFIG.map((step, index) => (
                  <Grid display="flex" alignItems="center" gap="8px" key={`step-${index}`}>
                    <Grid
                      container
                      item
                      position="relative"
                      justifyContent="center"
                      alignItems="center"
                      width="fit-content"
                      height="fit-content"
                      lineHeight="0"
                    >
                      <Typography
                        position="absolute"
                        top="50%"
                        color="white"
                        zIndex="10"
                        fontSize="13px"
                        lineHeight="0"
                        fontFamily="Poppins"
                        fontWeight="500"
                      >
                        {index + 1}
                      </Typography>
                      <Box position="relative">
                        <Hexagon />
                      </Box>
                    </Grid>
                    <Label
                      fontSize={{
                        xs: "12px",
                        sm: "15px",
                        minWidth: "145px",
                      }}
                      fontWeight={500}
                    >
                      {step.label}
                    </Label>
                    {step.checked ? (
                      <Box
                        width="18px"
                        height="18px"
                        minWidth="18px"
                        minHeight="18px"
                        bgcolor={"#2A8D5C"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="100px"
                      >
                        <CheckIcon />
                      </Box>
                    ) : null}
                  </Grid>
                ))}
              </Box>
            </Box>
            <Box display="flex" gap="24px" alignItems="center" justifyContent="flex-start" width="100%">
              <SharedSecondaryButton onClick={handleOnClick} disabled={isConnectionLoading}>
                {isConnectionLoading ? <Spinner /> : buttonTitle}
              </SharedSecondaryButton>
              <Button
                disableRipple
                onClick={onClose}
                disableFocusRipple
                sx={{
                  height: "40px",
                  width: "fit-content",
                  borderRadius: "100px",
                  textTransform: "none",
                  color: "#6D6D6D",
                  textAlign: "center",
                  fontFamily: "Space Grotesk",
                  fontSize: "16px",
                  fontWeight: 700,
                  textWrap: "nowrap",

                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
          <img
            src={"/images/bot-graphics.png"}
            style={{
              maxWidth: "360px",
              borderRadius: "100%",
            }}
          />
        </Grid>
      </Modal>
    </>
  );
};

export default InfoModal;
