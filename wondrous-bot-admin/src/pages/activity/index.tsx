import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import CmtyUserActivityComponent from "components/CmtyUserActivity";
import PageSpinner from "components/PageSpinner";
import Modal from "components/Shared/Modal";
import { GET_CMTY_USER_FROM_CODE } from "graphql/queries";
import { useLocation, useParams } from "react-router-dom";

const CmtyUserActivityPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const token = searchParams.get("token");

  const { data, loading, error } = useQuery(GET_CMTY_USER_FROM_CODE, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      code: token,
    },
    skip: !token,
  });

  const graphqlErrMessage = error?.graphQLErrors?.[0]?.extensions?.message;
  if (graphqlErrMessage) {
    return (
      <Modal noHeader open maxWidth={600}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          flexDirection="column"
          gap="16px"
        >
          <Typography color="black" fontWeight={600}>
            Oops! This Link Has Expired.
          </Typography>
          <Typography color="black" fontWeight={400}>
            To continue, please use the <a href="/my-activity">/my-activity</a> command on Discord to obtain a fresh
            link.
          </Typography>
        </Box>
      </Modal>
    );
  }
  if (loading || !data?.getCmtyUserFromCode?.cmtyUserId) return <PageSpinner />;

  const { cmtyUser, org } = data?.getCmtyUserFromCode || {};
  return <CmtyUserActivityComponent cmtyUser={cmtyUser} org={org} />;
};

export default CmtyUserActivityPage;
