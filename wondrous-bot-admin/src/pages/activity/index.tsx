import { useQuery } from "@apollo/client";
import CmtyUserActivityComponent from "components/CmtyUserActivity";
import PageSpinner from "components/PageSpinner";
import { GET_CMTY_USER_FROM_CODE } from "graphql/queries";
import { useLocation, useParams } from "react-router-dom";

const CmtyUserActivityPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const token = searchParams.get("token");

  const { data, loading } = useQuery(GET_CMTY_USER_FROM_CODE, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      code: token,
    },
    skip: !token,
  });

  console.log(data, loading, "yo");
  if (loading || !data?.getCmtyUserFromCode?.cmtyUserId) return <PageSpinner />;

  const { cmtyUser, org } = data?.getCmtyUserFromCode || {};
  return <CmtyUserActivityComponent cmtyUser={cmtyUser} org={org} />;
};

export default CmtyUserActivityPage;
