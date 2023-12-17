import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "../styles";

interface Props {
  error?: any;
  onChange: (value: string) => void;
}
const ConnectWallet = ({ error, ...rest }: Props) => {
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Question / Prompt for asking members to connect their wallet</Label>
      <TextField multiline={false} {...rest} error={error?.prompt} />
    </Grid>
  );
};

export default ConnectWallet;
