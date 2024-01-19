import { Box } from "@mui/material";
import { SignupAuthLayout } from "components/Shared/AuthLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingFinalizeComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SignupAuthLayout>
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
        <video
          src="/signup-loading.webm"
          autoPlay={true}
          loop={true}
          controls={false}
          width="auto"
          height="15%"
          muted
        />
      </Box>
    </SignupAuthLayout>
  );
};

export default OnboardingFinalizeComponent;
