import { useMutation } from "@apollo/client";
import PageSpinner from "components/PageSpinner";
import { GraphQLErrorExtensions } from "graphql";
import { CONNECT_CMTY_USER } from "graphql/mutations";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ERRORS_LABELS } from "utils/constants";
import useAlerts from "utils/hooks";

const DiscordCallbackCmtyUserConnect = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams?.get("code");
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const questId = searchParams?.get("state");
  const navigate = useNavigate();
  const [connectCmtyUser, { loading }] = useMutation(CONNECT_CMTY_USER, {
    onCompleted: ({ connectCmtyUser }) => {
      if (connectCmtyUser?.error) {
        console.log(connectCmtyUser?.error);
      }
      if (connectCmtyUser?.token) {
        localStorage.setItem("cmtyUserToken", connectCmtyUser?.token);
        navigate(`/quests/view/${questId}`);
      }
    },
    onError: (err) => {
      const message = err?.graphQLErrors[0]?.extensions?.message;
      const label = typeof message === 'string' ? ERRORS_LABELS[message] : null;
      setSnackbarAlertMessage(label || "Something went wrong, please try again later");
      setSnackbarAlertOpen(true);
      navigate(`/quests/view/${questId}?error=true&message=${message}`);
    },
  });

  useEffect(() => {
    if (code && questId && !loading) {
      connectCmtyUser({
        variables: {
          code,
          questId,
        },
      });
    }
  }, []);
  return <PageSpinner />;
};

export default DiscordCallbackCmtyUserConnect;
