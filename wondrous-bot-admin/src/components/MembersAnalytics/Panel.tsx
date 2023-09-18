import { Grid } from "@mui/material";

const Panel = ({ children }) => {
  return (
    <Grid padding="14px" borderRadius="6px" border="1px solid #000212" bgcolor="#F7F7F7">
      {children}
    </Grid>
  );
};

export default Panel;
