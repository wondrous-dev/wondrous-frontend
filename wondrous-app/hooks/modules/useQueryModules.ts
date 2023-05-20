import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, GET_POD_BY_ID } from 'graphql/queries';

type UseQueryModulesValue = {
  bounty: boolean;
  collab: boolean;
  document: boolean;
  grant: boolean;
  leaderboard: boolean;
  milestone: boolean;
  pod: boolean;
  proposal: boolean;
  task: boolean;
};

const defaultValue: UseQueryModulesValue = {
  bounty: undefined,
  collab: undefined,
  document: undefined,
  grant: undefined,
  leaderboard: undefined,
  milestone: undefined,
  pod: undefined,
  proposal: undefined,
  task: undefined,
};

const useQueryModules = ({ orgUsername = '', orgId = '', podId = '' }): UseQueryModulesValue => {
  const { data: getOrgFromUsernameData } = useQuery(GET_ORG_FROM_USERNAME, {
    skip: !orgUsername,
    variables: { username: orgUsername },
  });

  const { data: getOrgByIdData } = useQuery(GET_ORG_BY_ID, {
    skip: !orgId,
    variables: { orgId },
  });

  const { data: getPodByIdData } = useQuery(GET_POD_BY_ID, {
    skip: !podId,
    variables: { podId },
  });

  const modules =
    getPodByIdData?.getPodById?.modules ||
    getOrgByIdData?.getOrgById?.modules ||
    getOrgFromUsernameData?.getOrgFromUsername?.modules ||
    defaultValue;

  const modulesCopy = Object.keys(modules).reduce(
    (acc, key) => {
      if (podId && key === 'pod') {
        // If `podId` is provided, then `pod` should not be included..
        return acc;
      }
      const moduleValue = modules[key];
      if (typeof moduleValue !== 'boolean' && key !== '__typename') {
        // Converts all non-boolean values in `modules` to `true`.
        acc[key] = true;
        return acc;
      }
      acc[key] = moduleValue;
      return acc;
    },
    { ...modules }
  );

  return modulesCopy;
};

export default useQueryModules;
