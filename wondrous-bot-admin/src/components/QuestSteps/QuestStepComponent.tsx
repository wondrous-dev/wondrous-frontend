import { Grid, Typography, Box } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import SafeImage from "components/SafeImage";
import { useState } from "react";
import { useTakeQuest } from "utils/hooks";
import { StepModal } from "./StepModal";
import { TYPES, DEFAULT_BANNER_IMAGES } from "utils/constants";
import { StepTextField } from "./Steps";
import AttachmentType from "./Steps/Attachment";
import OptionSelect from "./Steps/OptionSelect";
import { VerifyButton } from "./Steps/VerifyButton";
import { Image } from "./styles";
import DataCollectionComponent from "./Steps/DataCollection";
import { ConnectWalletField } from "./Steps/ConnectWallet";

const COMPONENTS_CONFIG: any = {
  [TYPES.TEXT_FIELD]: StepTextField,
  [TYPES.MULTI_QUIZ]: OptionSelect,
  [TYPES.SINGLE_QUIZ]: OptionSelect,
  [TYPES.NUMBER]: (props) => <StepTextField type="tel" {...props} />,
  [TYPES.ATTACHMENTS]: AttachmentType,
  [TYPES.LINK_CLICK]: VerifyButton,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: VerifyButton,
  [TYPES.LIKE_YT_VIDEO]: VerifyButton,
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: VerifyButton,
  [TYPES.SNAPSHOT_SPACE_VOTE]: VerifyButton,
  [TYPES.VERIFY_TOKEN_HOLDING]: VerifyButton,
  [TYPES.DATA_COLLECTION]: DataCollectionComponent,
  [TYPES.LIKE_TWEET]: VerifyButton,
  [TYPES.FOLLOW_TWITTER]: VerifyButton,
  [TYPES.REPLY_TWEET]: VerifyButton,
  [TYPES.RETWEET]: VerifyButton,
  [TYPES.TWEET_WITH_PHRASE]: VerifyButton,
  [TYPES.CONNECT_WALLET]: ConnectWalletField,
};

const IMAGES_CONFIG = {
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: DEFAULT_BANNER_IMAGES.QUEST_STEP_SNAPSHOT,
  [TYPES.SNAPSHOT_SPACE_VOTE]: DEFAULT_BANNER_IMAGES.QUEST_STEP_SNAPSHOT,
};

const QuestStepComponent = ({ step, value, isActive, nextStepId, isWebView = false }) => {
  const Component: React.FC<any> = COMPONENTS_CONFIG[step?.type];
  const { onChange, isEditMode } = useTakeQuest();

  if (!isActive || !step) return null;
  if (Component) {
    return (
      <PanelComponent
        panelProps={
          isEditMode
            ? {
                filter: "None;",
                className: "quest-step-panel;",
              }
            : {
                className: "quest-step-panel",
              }
        }
        gridSx={
          isEditMode
            ? {
                borderRadius: "0px",
                padding: "0px",
              }
            : {}
        }
        renderHeader={
          isEditMode
            ? null
            : () => (
                <Grid
                  padding="14px"
                  bgcolor="#F7F7F7"
                  sx={{
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                >
                  <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={600} lineHeight="15px">
                    Quest Portal
                  </Typography>
                </Grid>
              )
        }
        renderBody={() => (
          <StepModal step={step} disabled={!value}>
            {IMAGES_CONFIG[step.type] ? <Image src={IMAGES_CONFIG[step.type]} /> : null}
            {step?.media ? (
              <Grid display="flex" alignItems="center" gap="14px" flexWrap="wrap" overflow="scroll">
                {step?.media?.map((item) => {
                  return (
                    <Box flex="1" minWidth="fit-content">
                      <SafeImage
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        width="auto"
                        src={item?.slug}
                      />
                    </Box>
                  );
                })}
              </Grid>
            ) : null}
            <Component
              step={step}
              value={value}
              onChange={(value) => onChange({ id: step.id, value })}
              placeholder="Enter answer"
            />
          </StepModal>
        )}
      />
    );
  }
  return null;
};

export default QuestStepComponent;
