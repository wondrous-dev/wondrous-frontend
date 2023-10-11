import { Grid } from "@mui/material";

const Panel = ({ children }) => {
  return (
    <Grid borderRadius="6px" border="1px solid black">
      {children}
    </Grid>
  );
};

export default Panel;
