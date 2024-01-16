import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { ShapedHexagonWrapper } from "components/Icons/Discord";
import { Grid, Box, Typography } from "@mui/material";
import { DiscordGif } from "components/Shared/DiscordRoleDisclaimer/styles";
import { QuestionMarkIcon } from "components/Icons/Tour";
import { DiscordRoleIcon } from "components/Icons/Rewards";
import { SharedSecondaryButton } from "components/Shared/styles";
import { ModalImage } from "./styles";
import QuestCelebrationComponent from "components/CreateTemplate/QuestCelebration";
import { useTour } from "@reactour/tour";

const typographyProps = {
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "24px",
  color: "black",
  textAlign: "left",
  fontFamily: "Poppins",
};

const FinishModalComponent = ({ header, subHeader, bodyText, imgBgColor, img, onClose }) => {
  const { setIsOpen, setCurrentStep, setSteps } = useTour();
  const typographies = [
    {
      content: header,
      textProps: {
        marginBottom: "6px",
      },
    },
    {
      content: subHeader,
      textProps: {
        fontSize: "15px",
      },
    },
    {
      content: bodyText,
      textProps: {
        fontSize: "15px",
        fontWeight: 500,
      },
    },
  ];

  const handleFinish = () => {
    setIsOpen(false);
    setCurrentStep(0);
    setSteps([]);
    onClose?.();
  };

  const infoPanels = [
    {
      content: "If you ever want to access these tours again, just click on the help icon on the sidebar!",
      icon: () => <QuestionMarkIcon />,
    },
    {
      icon: () => <DiscordRoleIcon width="25" height="25" />,
      customContent: () => (
        <Typography
          sx={{
            ...typographyProps,
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          If you have any questions, join <a href="https://discord.gg/wonderverse-907435897568505866">our Discord</a>{" "}
          and chat with the team and our community!
        </Typography>
      ),
    },
  ];

  return (
    <>
      <QuestCelebrationComponent withModal={false} onClose={() => {}} />
      <Modal noHeader open maxWidth={850}>
        <Grid
          display="flex"
          overflow="hidden"
          gap="24px"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          <Box display="flex" flexDirection="column" gap="8px">
            {typographies.map((item, idx) => (
              <Typography
                sx={{
                  ...typographyProps,
                  ...item.textProps,
                }}
              >
                {item.content}
              </Typography>
            ))}
            <Box display="flex" flexDirection="column" gap="14px" marginTop="16px">
              {infoPanels.map((panel, idx) => (
                <Box
                  padding="8px"
                  display="flex"
                  gap="14px"
                  width="100%"
                  alignItems="center"
                  borderRadius="12px"
                  border="1px solid #E4E4E4"
                >
                  <Box width="25px" height="25px">
                    {panel?.icon?.()}
                  </Box>
                  {panel.customContent ? (
                    panel.customContent()
                  ) : (
                    <Typography
                      sx={{
                        ...typographyProps,
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {panel.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            <Box flex="1" />
            <Box marginTop="42px">
              <SharedSecondaryButton onClick={handleFinish} minWidth="170px">
                Finish
              </SharedSecondaryButton>
            </Box>
          </Box>
          <Box
            width={{
              xs: "100%",
              sm: "50%",
            }}
          >
            <Box
              width="100%"
              height="100%"
              bgcolor={imgBgColor}
              borderRadius="12px"
              border="1px solid #cbcbcb"
              display="flex"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              <ModalImage src={img} />
            </Box>
          </Box>
        </Grid>
      </Modal>
    </>
  );
};

export default FinishModalComponent;
