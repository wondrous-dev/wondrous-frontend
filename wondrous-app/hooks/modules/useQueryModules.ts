import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID, GET_ORG_FROM_USERNAME } from 'graphql/queries';

const useQueryModules = ({ orgUsername = '', orgId = '', podId = '' }) => {
  const { data: getOrgFromUsernameData } = useQuery(GET_ORG_FROM_USERNAME, {
    skip: !orgUsername,
    variables: { username: orgUsername },
  });

  const { data: getOrgByIdData } = useQuery(GET_ORG_BY_ID, {
    skip: !orgId,
    variables: { orgId },
  });

  // TODO: Add podId query

  const modules = getOrgFromUsernameData?.getOrgFromUsername?.modules || getOrgByIdData?.getOrgById?.modules;

  const modulesCopy = modules && { ...modules };
  if (modulesCopy) {
    // Converts all non-boolean values in `modules` to `true`.
    Object.keys(modulesCopy).forEach((module) => {
      const moduleValue = modulesCopy[module];
      if (typeof moduleValue !== 'boolean' && module !== '__typename') {
        modulesCopy[module] = true;
      }
    });
  }

  return modulesCopy;
};

export default useQueryModules;
