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

const COMPONENTS_CONFIG: any = {
  [TYPES.TEXT_FIELD]: StepTextField,
  [TYPES.MULTI_QUIZ]: OptionSelect,
  [TYPES.SINGLE_QUIZ]: OptionSelect,
  [TYPES.NUMBER]: (props) => <StepTextField type="number" {...props} />,
  [TYPES.ATTACHMENTS]: AttachmentType,
  [TYPES.LINK_CLICK]: VerifyButton,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: VerifyButton,
  [TYPES.LIKE_YT_VIDEO]: VerifyButton,
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: VerifyButton,
  [TYPES.SNAPSHOT_SPACE_VOTE]: VerifyButton,

  [TYPES.VERIFY_TOKEN_HOLDING]: VerifyButton,
  [TYPES.DATA_COLLECTION]: DataCollectionComponent
};

const IMAGES_CONFIG = {
  [TYPES.SNAPSHOT_PROPOSAL_VOTE]: DEFAULT_BANNER_IMAGES.QUEST_STEP_SNAPSHOT,
  [TYPES.SNAPSHOT_SPACE_VOTE]: DEFAULT_BANNER_IMAGES.QUEST_STEP_SNAPSHOT,
  [TYPES.ATTACHMENTS]: DEFAULT_BANNER_IMAGES.ATTACHMENT_REQUIRED,
};

const QuestStepComponent = ({ step, value, isActive, nextStepId, isWebView = false }) => {
  const Component: React.FC<any> = COMPONENTS_CONFIG[step?.type];
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const { onChange, isEditMode } = useTakeQuest();
  if (!isActive || !step) return null;
  if (Component) {
    return (
      <PanelComponent
        panelProps={
          isEditMode
            ? {
                filter: "None;",
              }
            : {}
        }
        gridSx={
          isEditMode
            ? {
                borderRadius: "0px",
                padding: '0px'
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
          <StepModal step={step} nextStepId={nextStepId} disabled={!value || isActionDisabled}>
            {IMAGES_CONFIG[step.type] ? <Image src={IMAGES_CONFIG[step.type]} /> : null}
            <Component
              step={step}
              value={value}
              isActionDisabled={isActionDisabled}
              setIsActionDisabled={setIsActionDisabled}
              onChange={(value) => onChange({ id: step.id, value })}
              placeholder="Enter answer"
            />
            {step?.media ? (
              <Grid display="flex" alignItems="center" gap="14px">
                {step?.media?.map((item) => {
                  return (
                    <Box>
                      <SafeImage
                        style={{
                          maxHeight: "200px",
                        }}
                        width="auto"
                        src={item?.slug}
                      />
                    </Box>
                  );
                })}
              </Grid>
            ) : null}
          </StepModal>
        )}
      />
    );
  }
  return null;
};

export default QuestStepComponent;
