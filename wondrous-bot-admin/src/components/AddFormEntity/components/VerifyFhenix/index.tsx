import { Grid, Typography, Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import InfoIcon from "components/Icons/InfoIcon";
import { Label } from "../styles";
import { TYPES } from "utils/constants";

interface Props {
  error?: any;
  onChange: (value: string) => void;
  stepType?: string;
  value?: any;
}

const FHENIX_INFO_TEXT = {
  [TYPES.VERIFY_FHENIX_WALLET_GAS_USAGE]: "Users will be asked to verify how much gas their wallet has used on Fhenix.",
  [TYPES.VERIFY_FHENIX_ACTIVE_WALLET]:
    "Users will be asked to verify that they have an active wallet connected to Fhenix.",
  [TYPES.VERIFY_FHENIX_FAUCET_INTERACTION]:
    "Users will be asked to verify that they have interacted with a Fhenix Faucet",
  [TYPES.VERIFY_FHENIX_CONTRACTS_CREATED]:
    "Users will be asked to verify how many contracts they've created on Fhenix.",
  [TYPES.NEW_FHENIX_CONTRACTS_CREATED]
    : "Users will be asked to verify how many contracts they've created on Fhenix.",
  [TYPES.NEW_FHENIX_WALLET_GAS_USAGE]
    : "Users will be asked to verify how much gas their wallet has used on Fhenix.",
  [TYPES.NEW_FHENIX_GAS_CONSUMED_BY_CONTRACTS]
    : "Users will be asked to verify how much gas their contracts have consumed on Fhenix.",
  [TYPES.NEW_FHENIX_CONTRACTS_VERIFIED]
    : "Users will be asked to verify how many contracts they've verified on Fhenix.",
};
const VerifyFhenixIntegrations = ({ error, ...rest }: Props) => {
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
          {FHENIX_INFO_TEXT[rest.stepType]}
        </Typography>
      </Box>
    </Grid>
  );
};

export default VerifyFhenixIntegrations;
