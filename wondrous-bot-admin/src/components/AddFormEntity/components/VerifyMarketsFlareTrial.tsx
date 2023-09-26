import { Grid, Typography, Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "./styles";
import InfoIcon from "components/Icons/InfoIcon";

interface Props {
  error?: any;
  onChange: (value: string) => void;
}
const VerifyMarketsFlareTrial = ({ error, ...rest }: Props) => {
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Question / Prompt</Label>
      <TextField multiline={false} {...rest} error={error?.prompt} {...rest} />
      <Box display="flex" alignItems="center" marginTop="6px">
        <InfoIcon
          style={{
            marginRight: "8px",
          }}
        />
        <Typography fontFamily="Poppins" fontWeight={500} fontSize={"13px"} color="#A5A5A5">
          Users will be asked to check if they have a MarketsFlare trial account connected to their Discord.
        </Typography>
      </Box>
    </Grid>
  );
};

export default VerifyMarketsFlareTrial;
