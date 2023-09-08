import { Grid, Typography, Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "./styles";
import InfoIcon from "components/Icons/InfoIcon";

interface Props {
  error?: any;
}
const ReferralComponent = ({ error, ...rest }: Props) => {
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Question / Prompt</Label>
      <TextField multiline={false} {...rest} error={error?.prompt} />
      <Box display="flex" alignItems="center" marginTop="6px">
        <InfoIcon
          style={{
            marginRight: "8px",
          }}
        />
        <Typography fontFamily="Poppins" fontWeight={500} fontSize={"13px"} color="#A5A5A5">
          When their friend clicks on the referral link, and completes a quest, the referrer will receive the reward/s.
        </Typography>
      </Box>
    </Grid>
  );
};

export default ReferralComponent;
