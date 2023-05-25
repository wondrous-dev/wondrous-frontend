import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME, GET_POD_BY_ID } from 'graphql/queries';

type UseQueryModulesValue = {
  bounty: boolean;
  collab?: boolean;
  document: boolean;
  grant: boolean;
  leaderboard: boolean;
  milestone: boolean;
  pod?: boolean;
  proposal: boolean;
  task: boolean;
  parentOrgPodModuleStatus?: boolean;
};

const defaultPodModules = {
  bounty: true,
  document: true,
  grant: true,
  leaderboard: true,
  milestone: true,
  proposal: true,
  task: true,
  parentOrgPodModuleStatus: true,
};

const defaultOrgModules = {
  bounty: true,
  collab: true,
  document: true,
  grant: true,
  leaderboard: true,
  milestone: true,
  pod: true,
  proposal: true,
  task: true,
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

  const orgModules = getOrgByIdData?.getOrgById?.modules || getOrgFromUsernameData?.getOrgFromUsername?.modules;

  const modules = podId ? getPodByIdData?.getPodById?.modules : orgModules;

  if (!modules) return podId ? defaultPodModules : defaultOrgModules;

  const modulesCopy =
    modules &&
    Object.keys(modules).reduce(
      (acc, key) => {
        if (podId && key === 'collab') {
          // exclude the `collab` key if `podId` is provided.
          return acc;
        }
        if (podId && key === 'pod') {
          // If `podId` is provided, exclude the `pod` key but include the status of the parent org's `pod` module.
          acc.parentOrgPodModuleStatus = orgModules?.pod;
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
