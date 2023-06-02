import { useLazyQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import { GET_BADGE_SPEC, GET_RAFT_INFO, GET_RAFT_WITH_SPECS } from 'graphql/queries';

const OTTERSPACE_URI = 'https://api.thegraph.com/subgraphs/name/otterspace-xyz/badges-polygon';

const cache = new InMemoryCache();
const otterspaceClientGQL = new ApolloClient({
  cache,
  uri: OTTERSPACE_URI,
});

const useOtterspace = () => {
  const [getRaftInfoData] = useLazyQuery(GET_RAFT_INFO, {
    client: otterspaceClientGQL,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [getRaftInfoWithSpecs] = useLazyQuery(GET_RAFT_WITH_SPECS, {
    client: otterspaceClientGQL,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [getOtterspaceBadgeSpec] = useLazyQuery(GET_BADGE_SPEC, {
    client: otterspaceClientGQL,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const getRaftInfo = async (raftId: string) => {
    try {
      const { data } = await getRaftInfoData({ variables: { id: raftId } });
      return data;
    } catch (error) {
      console.log(error, 'error');
      return {};
    }
  };

  const getRaftWithSpecs = async (raftId: string) => {
    try {
      const { data } = await getRaftInfoWithSpecs({ variables: { id: raftId } });
      return data;
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const getBadgeSpec = async (badgeId: string) => {
    try {
      const { data } = await getOtterspaceBadgeSpec({ variables: { id: badgeId } });
      return data;
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return {
    getRaftInfo,
    getRaftWithSpecs,
    getBadgeSpec,
  };
};

export default useOtterspace;
