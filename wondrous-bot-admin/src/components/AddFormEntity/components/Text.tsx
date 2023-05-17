import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "./styles";

interface Props {
  error?: any;
  onChange: (value: string) => void;
}
const TextComponent = ({ error, ...rest }: Props) => {
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Question / Prompt</Label>
      <TextField multiline={false} {...rest} error={error?.prompt} />
    </Grid>
  );
};

export default TextComponent;
