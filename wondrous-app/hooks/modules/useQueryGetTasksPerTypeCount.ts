import { useQuery } from '@apollo/client';
import { GET_TASKS_PER_TYPE, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';

const useQueryGetTasksPerTypeCount = ({ orgId = '', podId = '' }) => {
  const { data: orgData } = useQuery(GET_TASKS_PER_TYPE, {
    variables: {
      orgId,
    },
    skip: Boolean(!orgId || podId),
  });
  const { data: podData } = useQuery(GET_TASKS_PER_TYPE_FOR_POD, {
    variables: {
      podId,
    },
    skip: !podId,
  });
  return orgData?.getPerTypeTaskCountForOrgBoard || podData?.getPerTypeTaskCountForPodBoard;
};

export default useQueryGetTasksPerTypeCount;
