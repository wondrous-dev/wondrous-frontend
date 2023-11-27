import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORG_QUESTS_LEVELS } from "graphql/queries";
import { useEffect, useMemo } from "react";
import { LEVELS_DEFAULT_NAMES } from "./constants";

interface IUseLevels {
  orgId: string;
  shouldFetch?: boolean;
}
const useLevels = ({ orgId, shouldFetch = true }: IUseLevels) => {
  const { data, refetch, loading } = useQuery(GET_ORG_QUESTS_LEVELS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "cache-first",
    skip: !shouldFetch || !orgId,
    variables: {
      orgId,
    },
  });
  
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
    loading,
  };
};

export default useLevels;
