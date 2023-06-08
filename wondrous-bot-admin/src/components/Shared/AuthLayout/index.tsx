import { Box, Grid } from "@mui/material";
import CollectCredentials from "components/SignupComponent/CollectCredentials";
import { Link } from "react-router-dom";
import { SharedSecondaryButton } from "../styles";
import { MainWrapper } from "./styles";

const AuthLayout = ({children, headerButton = null}) => <MainWrapper>
<Box bgcolor="black" borderRadius="20px" width="500px">
  <Grid
    bgcolor="white"
    container
    width="100%"
    sx={{
      transform: "translateY(-20px)",
    }}
    direction="column"
    borderRadius="20px"
    border="1px solid #06040A"
    overflow="hidden"
  >
    <Grid item>
      <Box
        padding="24px 20px"
        bgcolor="#F7F7F7"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <img src="/wonder-black.svg" />
       {headerButton ? headerButton() : null}
      </Box>
      {children}
    </Grid>
  </Grid>
</Box>
</MainWrapper>

export default AuthLayout;