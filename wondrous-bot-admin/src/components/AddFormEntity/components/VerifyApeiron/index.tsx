import { Grid, Typography, Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import InfoIcon from "components/Icons/InfoIcon";
import { Label } from "../styles";
import { TYPES } from "utils/constants";

interface Props {
  error?: any;
  onChange: (value: string) => void;
  stepType?: string;
}

const APEIRON_INFO_TEXT = {
  [TYPES.VERIFY_APEIRON_10_MINS_PLAYED]: "Users will be asked to verify that they have played 10 mins of Apeiron.",
  [TYPES.VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS]:
    "Users will be asked to verify that they have an Apeiron account connected to their wallet address.",
  [TYPES.VERIFY_APEIRON_APOSTLES_IV_OVER_80]:
    "Users will be asked to verify that they have an Apeiron Apostles IV over 80.",
  [TYPES.VERIFY_APEIRON_DEFEAT_FIRST_BOSS]:
    "Users will be asked to verify that they have defeated the first boss in Apeiron.",
};
const VerifyApeironIntegrations = ({ error, ...rest }: Props) => {
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
          {APEIRON_INFO_TEXT[rest.stepType]}
        </Typography>
      </Box>
    </Grid>
  );
};

export default VerifyApeironIntegrations;
