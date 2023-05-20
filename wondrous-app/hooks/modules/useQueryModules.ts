import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME } from 'graphql/queries';

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

  // TODO: Add podId query

  const modules =
    getOrgFromUsernameData?.getOrgFromUsername?.modules || getOrgByIdData?.getOrgById?.modules || defaultValue;

  const modulesCopy = Object.keys(modules).reduce(
    (acc, key) => {
      // Converts all non-boolean values in `modules` to `true`.
      const moduleValue = modules[key];
      if (typeof moduleValue !== 'boolean' && key !== '__typename') {
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
