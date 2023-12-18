import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL } from "graphql/queries";
import { useQuery } from "@apollo/client";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { SuccessInfoButton } from "./styles";

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
  orgId,
  orgProfilePicture,
}) => {
  const { data, loading } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL, {
    variables: {
      orgId: orgId,
    },
    skip: !isOpen,
  });

  const STEPS_CONFIG = [
    {
      buttonLabel: showJoinDiscord || showStartQuest ? "Connected" : "Connect",
      isActive: showConnect,
      label: "Connect Discord",
      hasCompleted: showJoinDiscord || showStartQuest,
      img: "/images/info-discord-icon.png",
      onClick: handleOnConnect,
    },
    {
      buttonLabel: showStartQuest ? "Joined" : `Join`,
      label: `Join ${data?.getCmtyOrgDiscordConfig?.guildInfo?.guildName || "server"}`,
      isActive: showJoinDiscord,
      hasCompleted: showStartQuest,
      img: orgProfilePicture,
      imgType: "org",
      onClick: handleJoinDiscord,
    },
  ];

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title={null}
        maxWidth={700}
        footerCenter
        footerRight={
          <SharedSecondaryButton disabled={!showStartQuest || isConnectionLoading} onClick={onStartQuest}>
            {isConnectionLoading && showStartQuest ? <Spinner /> : "Start Quest"}
          </SharedSecondaryButton>
        }
      >
        <Grid display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="24px">
          <Box display="flex" flexDirection="column" gap="12px">
            <Label
              fontSize={{
                xs: "14px",
                sm: "17px",
              }}
              color="#626262"
              fontWeight={700}
              sx={{
                textAlign: "center",
              }}
            >
              Hold Up, Adventurer!
            </Label>
            <Label
              fontSize={{
                xs: "14px",
                sm: "17px",
              }}
              color="#626262"
              sx={{
                textAlign: "center",
              }}
              fontWeight={500}
            >
              To unlock your quest, connect Discord and join our realm!
            </Label>
          </Box>
          <Box
            display="flex"
            width="100%"
            gap="14px"
            justifyContent="center"
            flexDirection={{
              xs: "column",
              sm: "row",
            }}
          >
            {STEPS_CONFIG.map((step, idx) => {
              return (
                <Box
                  bgcolor="#F7F7F7"
                  borderRadius="16px"
                  flex="1"
                  display="flex"
                  padding="24px"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap="14px"
                >
                  {step.imgType === "org" ? (
                    <Box
                      border="1px solid black"
                      borderRadius="300px"
                      height={"65px"}
                      width="65px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      overflow="hidden"
                    >
                      <OrgProfilePicture
                        profilePicture={orgProfilePicture}
                        style={{
                          height: "65px",
                          width: "100%",
                          borderRadius: "100%",
                        }}
                      />
                    </Box>
                  ) : (
                    <img src={step.img} width="65px" />
                  )}
                  <Label
                    color="#2A8D5C"
                    fontSize={{
                      xs: "14px",
                      sm: "18px",
                    }}
                    fontWeight={600}
                  >
                    {step.label}
                  </Label>
                  <Divider bgColor="#E8E8E8" />
                  <Box flex="1" display="flex" alignItems="flex-end">
                    {step.hasCompleted ? (
                      <SuccessInfoButton>{step.buttonLabel}</SuccessInfoButton>
                    ) : (
                      <SharedSecondaryButton
                        width="100%"
                        disabled={!step.isActive || isConnectionLoading}
                        onClick={step.onClick}
                      >
                        {isConnectionLoading && step.isActive ? <Spinner /> : step.buttonLabel}
                      </SharedSecondaryButton>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Modal>
    </>
  );
};

export default InfoModal;
