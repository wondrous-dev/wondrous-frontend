import { Box, Grid, useMediaQuery } from "@mui/material";
import CollectCredentials from "components/SignupComponent/CollectCredentials";
import { Link } from "react-router-dom";
import { SharedSecondaryButton } from "../styles";
import { MainWrapper } from "./styles";

const AuthLayout = ({ children, headerButton = null, showHeader = true }) => (
  <MainWrapper>
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
          {showHeader ? (
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
          ) : null}
          {children}
        </Grid>
      </Grid>
    </Box>
  </MainWrapper>
);

const SignupHeader = () => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  return (
    <Box
      width="100%"
      padding="14px"
      alignItems="center"
      justifyContent="flex-start"
      height="fit-content"
      zIndex="9999"
      borderBottom={isMobile ? "1px solid black" : "1px solid transparent"}
      bgcolor={isMobile ? "white" : "transparent"}
    >
      <img src={isMobile ? "/wonder-black.svg" : "/wonder-white.svg"} />
    </Box>
  );
};

export const SignupAuthLayout = ({ children }) => {
  return (
    <Grid
      width="100%"
      minHeight="100vh"
      height="100%"
      display="flex"
      bgcolor="#AF95FC"
      flexDirection="column"
      overflow="hidden"
    >
      <SignupHeader />
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" flex="1">
        {children}
      </Box>
    </Grid>
  );
};
export default AuthLayout;
