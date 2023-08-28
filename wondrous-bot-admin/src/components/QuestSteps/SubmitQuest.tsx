import { Box, Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { DEFAULT_BANNER_IMAGES } from "utils/constants";
import { Image } from "./styles";
import { SharedSecondaryButton } from "components/Shared/styles";

const SubmitQuest = ({
    handleSubmit
}) => {
  return (
    <PanelComponent
      renderHeader={() => (
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
      )}
      renderBody={() => (
        <Grid display="flex" flexDirection="column" gap="24px" width="100%" justifyContent="center" alignItems="center">
          <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={700} lineHeight="14px">
            Ready to submit the quest?
          </Typography>
          <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={400} lineHeight="14px">
            Do you want to submit your response?
          </Typography>

          <Image src={DEFAULT_BANNER_IMAGES.QUEST_READY_TO_SUBMIT} style={{
            height: '81px'
          }} />
          <Box display="flex" gap="14px">
            <SharedSecondaryButton $reverse>Edit Responses</SharedSecondaryButton>
            <SharedSecondaryButton
            onClick={handleSubmit}
            >Submit Quest</SharedSecondaryButton>
          </Box>
        </Grid>
      )}
    />
  );
};

export default SubmitQuest;
