import { Box, Grid } from "@mui/material";
import AuthLayout from "components/Shared/AuthLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Link, useNavigate } from "react-router-dom";
import CollectCredentials from "./CollectCredentials";

const SignupComponent = () => {
  const navigate = useNavigate();

  const moveForward = () => navigate("/onboarding/welcome");

  return (
    <AuthLayout
      headerButton={() => (
        <Link to="/login">
          <SharedSecondaryButton>Back to Login</SharedSecondaryButton>
        </Link>
      )}
    >
      <CollectCredentials moveForward={moveForward} />
    </AuthLayout>
  );
};

export default SignupComponent;
