import { ButtonBase, Typography } from "@mui/material";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import GoogleIcon from "./icon";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GOOGLE_LOGIN_MUTATION } from "graphql/mutations";
import { storeAuthHeader } from "components/Auth";
import { useNavigate } from "react-router-dom";
import { getBaseUrl, handleUserOnboardingRedirect } from "utils/common";
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from "graphql/queries";

const GoogleOAuthButton = ({ params = {} }) => {
  const navigate = useNavigate();

  const [getLoggedInUserFullAccessOrgs] = useLazyQuery(GET_LOGGED_IN_USER_FULL_ACCESS_ORGS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.getLoggedInUserFullAccessOrgs.length === 0) {
        handleUserOnboardingRedirect(null, navigate, params, "/onboarding/welcome?ref=signup");
        return;
      }
      handleUserOnboardingRedirect(null, navigate, params, "/");
    },
  });
  const handleCompleted = async ({ token, user, callback }) => {
    await storeAuthHeader(token, user);
    callback?.();
  };

  const handleRedirect = () => {
    getLoggedInUserFullAccessOrgs({
      variables: {
        excludeSharedOrgs: true,
        cmtyEnabled: true,
      },
    });
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
    redirect_uri: `${getBaseUrl()}/oauth/google/callback`,
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
