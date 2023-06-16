import { Box, Grid } from "@mui/material";
import AuthLayout from "components/Shared/AuthLayout";
import { LinkWithQuery } from "components/Shared/LinkWithQuery";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleUserOnboardingRedirect } from "utils/common";
import CollectCredentials from "./CollectCredentials";

const SignupComponent = () => {
  const navigate = useNavigate();

  const {search} = useLocation();

  const searchParams = new URLSearchParams(search);

  const discordConnectError = searchParams.get('discordConnectError');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  
  const params = {
    discordConnectError,
    token,
    type
  }

  const moveForward = () => handleUserOnboardingRedirect(null, navigate, params, "/onboarding/welcome");

  return (
    <AuthLayout
      headerButton={() => (
        <LinkWithQuery to="/login">
          <SharedSecondaryButton>Back to Login</SharedSecondaryButton>
        </LinkWithQuery>
      )}
    >
      <CollectCredentials moveForward={moveForward} />
    </AuthLayout>
  );
};

export default SignupComponent;
