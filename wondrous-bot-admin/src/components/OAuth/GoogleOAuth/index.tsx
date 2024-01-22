import { ButtonBase, Typography } from "@mui/material";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import GoogleIcon from "./icon";
import { useMutation } from "@apollo/client";
import { GOOGLE_LOGIN_MUTATION } from "graphql/mutations";
import { storeAuthHeader } from "components/Auth";
import { useNavigate } from "react-router-dom";
const GoogleOAuthButton = ({ isSignup = false }) => {
  const handleCompleted = async ({ token, user, callback }) => {
    await storeAuthHeader(token, user);
    callback?.();
  };

  const navigate = useNavigate();

  const handleRedirect = () => {
    if (isSignup) {
      navigate("/onboarding/welcome?ref=signup");
    }
    navigate("/");
  };

  const [signInUser] = useMutation(GOOGLE_LOGIN_MUTATION, {
    onCompleted: ({ googleSignin }) => {
      const { user, token } = googleSignin;
      if (googleSignin?.user) {
        handleCompleted({ token, user, callback: handleRedirect });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const login = useGoogleLogin({
    flow: "auth-code",
    scope: "email",
    onSuccess: (tokenResponse) => {
      const { code } = tokenResponse;
      signInUser({ variables: { code: code } });
    },
    onError: (error) => console.log(error),
  });

  return (
    <ButtonBase
      onClick={() => login()}
      sx={{
        width: "100%",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "35px",
        border: "2px solid #84BCFF",

        background: "#FFF",
        padding: "8px 24px",
        "&:hover": {
          border: "2px solid #1976D2",
        },
      }}
    >
      <GoogleIcon />
      <Typography
        color="black"
        fontFamily="Poppins"
        fontSize="15px"
        fontWeight={600}
        lineHeight="150%"
        letterSpacing="-0.15px"
      >
        Continue with Google
      </Typography>
    </ButtonBase>
  );
};

export default GoogleOAuthButton;
