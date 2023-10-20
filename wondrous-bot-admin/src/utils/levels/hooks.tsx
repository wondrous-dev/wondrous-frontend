import { useLazyQuery } from '@apollo/client';
import { GET_ORG_QUESTS_LEVELS } from 'graphql/queries';
import { useEffect, useMemo } from 'react';
import { LEVELS_DEFAULT_NAMES } from './constants';

interface IUseLevels {
  orgId: string;
  shouldFetch?: boolean;
}
const useLevels = ({ orgId, shouldFetch = true }: IUseLevels) => {
  const [getLevels, { data, refetch, loading }] = useLazyQuery(GET_ORG_QUESTS_LEVELS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (shouldFetch && orgId) {
      getLevels({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, shouldFetch]);

  const normalzdValues = useMemo(() => {
    const levels = { ...LEVELS_DEFAULT_NAMES };

    data?.getOrgQuestsLevels.forEach((item) => {
      const key = item.key;
      const value = item.value;
      if (key in levels) {
        levels[key] = value;
      }
    });
    return levels;
  }, [data?.getOrgQuestsLevels]);

  return {
    levels: normalzdValues,
    loading
  };
};

export default useLevels;
