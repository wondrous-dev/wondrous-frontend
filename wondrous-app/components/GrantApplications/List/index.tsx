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
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';
import ListItem from '../ListItem';

const List = ({ display = false }) => {
  const { toggleCreateApplicationModal, grant } = useTaskContext();
  const [status, setStatus] = useState(GRANT_APPLICATION_STATUSES.OPEN);
  const [hasMore, setHasMore] = useState(false);
  const user = useMe();
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
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: data?.getGrantApplicationsForGrant?.length,
        },
      }).then(({ data }) => setHasMore(data?.getGrantApplicationsForGrant?.length >= LIMIT));
    }
  }, [inView, hasMore]);

  if (!display) return null;

  return (
    <>
      <TaskSubmissionsLoading loading={false} />

      <Grid container justifyContent="space-between" alignItems="center">
        <Filters setStatus={handleFilter} status={status} />
        <RequestApproveButton onClick={toggleCreateApplicationModal} data-cy="application-button">
          Apply for grant
        </RequestApproveButton>
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
