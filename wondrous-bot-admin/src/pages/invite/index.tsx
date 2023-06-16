import { useLazyQuery, useMutation } from "@apollo/client";
import { useMe, withAuth } from "components/Auth";
import PageSpinner from "components/PageSpinner";
import { REDEEM_ORG_INVITE_LINK } from "graphql/mutations";
import { GET_ORG_INVITE_ORG_INFO } from "graphql/queries";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";

const InvitePage = () => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  let { token } = useParams();
  const { setActiveOrg } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [getOrgInviteOrgInfo, { data: orgData }] = useLazyQuery(GET_ORG_INVITE_ORG_INFO);

  const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK, {
    refetchQueries: ["getLoggedInUserFullAccessOrgs"],
    onCompleted: (data) => {
      if (!data?.redeemOrgInviteLink?.success) {
        setSnackbarAlertMessage("Something went wrong! Please try again later or contact project admin");
        setSnackbarAlertOpen(true);
        return;
      }
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertOpen(true);
      setActiveOrg(orgData?.getInvitedOrgInfo);
      return navigate("/");
    },
  });
  const {user, loading} = useMe();
  console.log(user, loading, 'ASD')
  const handleInvite = async () => {
    if (!user) {
      return navigate(`/login?token=${token}`);
    }
    try {
      const { data } = await getOrgInviteOrgInfo({
        variables: {
          token,
        },
      });
      console.log('data here', data?.getInvitedOrgInfo?.id)
      if (data?.getInvitedOrgInfo?.id) {
        await redeemOrgInviteLink({
          variables: {
            token,
          },
        });
      }
    } catch (error) {
      setSnackbarAlertMessage("Something went wrong. Please try again later or contact project admin");
      setSnackbarAlertOpen(true);
    }
  };
  useEffect(() => {
    if (token && !loading) {
      handleInvite();
    }
  }, [token, loading]);

  return <PageSpinner />;
};

export default withAuth(InvitePage);
