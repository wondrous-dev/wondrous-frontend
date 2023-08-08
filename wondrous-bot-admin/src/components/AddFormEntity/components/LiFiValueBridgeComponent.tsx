import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "./styles";

interface Props {
  error?: any;
  onChange: (value: string) => void;
}
const LifiValueBridgeComponent = ({ error, ...rest }: Props) => {
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Amount user needs to bridge in USD value (whole numbers only)</Label>
      <TextField type="number" multiline={false} {...rest} error={error?.prompt} />
    </Grid>
  );
};

export default LifiValueBridgeComponent;
