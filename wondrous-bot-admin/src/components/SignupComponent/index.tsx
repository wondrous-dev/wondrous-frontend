import { Box, Grid } from "@mui/material";
import AuthLayout, { SignupAuthLayout } from "components/Shared/AuthLayout";
import { LinkWithQuery } from "components/Shared/LinkWithQuery";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleUserOnboardingRedirect } from "utils/common";
import CollectCredentials from "./CollectCredentials";
import MetaPixel from "components/MetaPixel";

const SignupComponent = () => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const discordConnectError = searchParams.get("discordConnectError");
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const params = {
    discordConnectError,
    token,
    type,
  };

  const moveForward = () => handleUserOnboardingRedirect(null, navigate, params, "/onboarding/welcome?ref=signup");

  return (
    <SignupAuthLayout>
      <MetaPixel />
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="60%" flex="1">
        <Box display="flex" justifyContent="center" alignItems="center" padding="20px">
          <Box bgcolor="black" borderRadius="20px" maxWidth="500px">
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
                <CollectCredentials moveForward={moveForward} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </SignupAuthLayout>
  );
};

export default SignupComponent;
