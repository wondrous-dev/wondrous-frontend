import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { TaskSubmissionItemsWrapper } from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsLoading } from 'components/Common/TaskSubmission/submission';
import Filters from 'components/GrantApplications/Filters';
import { RequestApproveButton } from 'components/organization/members/styles';
import { GET_GRANT_APPLICATIONS } from 'graphql/queries';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { GRANT_APPLICATION_STATUSES, GRANT_APPLY_POLICY } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useGlobalContext, useOrgBoard, usePodBoard, useTaskContext } from 'utils/hooks';
import ListItem from '../ListItem';

const List = ({ display = false }) => {
  const { toggleCreateApplicationModal, grant } = useTaskContext();
  const [status, setStatus] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const user = useMe();
  const { userOrgs } = useGlobalContext();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();

  const board = orgBoard || podBoard;

  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });
  const isMember =
    userOrgs?.getUserOrgs?.some((org) => org.id === grant?.org?.id) ||
    board?.userPermissionsContext?.podPermissions[grant?.pod?.id];

  const [ref, inView] = useInView({});
  const { data, fetchMore, refetch, previousData, loading } = useQuery(GET_GRANT_APPLICATIONS, {
    variables: {
      status,
      grantId: grant?.id,
      limit: LIMIT,
      offset: 0,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantApplicationsForGrant?.length >= LIMIT;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
    skip: !grant?.id || !display,
  });

  const handleFilter = (status) => {
    setStatus(status);
    refetch({
      status,
      grantId: grant?.id,
    });
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMore({
        variables: {
          offset: data?.getGrantApplicationsForGrant?.length,
        },
      }).then(({ data }) => setHasMore(data?.getGrantApplicationsForGrant?.length >= LIMIT));
    }
  }, [inView, hasMore]);

  if (!display) return null;

  const canApply = grant?.applyPolicy === GRANT_APPLY_POLICY.EVERYONE || isMember;

  return (
    <>
      <TaskSubmissionsLoading loading={false} />

      <Grid container justifyContent="space-between" alignItems="center">
        <Filters setStatus={handleFilter} status={status} />
        {canApply ? (
          <RequestApproveButton onClick={toggleCreateApplicationModal} data-cy="application-button">
            Apply for Grant
          </RequestApproveButton>
        ) : null}
      </Grid>
      <TaskSubmissionItemsWrapper data-cy="item-submission">
        {data?.getGrantApplicationsForGrant?.map((item, idx) => (
          <ListItem key={item.id} item={item} />
        ))}
        <LoadMore ref={ref} hasMore={hasMore} />
      </TaskSubmissionItemsWrapper>
    </>
  );
};

export default withAuth(List);
