import { Grid } from "@mui/material";
import { Label } from "../styles";

export default function LocationComponent() {
  return (
    <Grid
      item
      gap="14px"
      display="flex"
      flexDirection="column"
      xs={12}
      style={{
        width: "100%",
      }}
    >
      <Label>This type will collect user's location</Label>
    </Grid>
  );
}
