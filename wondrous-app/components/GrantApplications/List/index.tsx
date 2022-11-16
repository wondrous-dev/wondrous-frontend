import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { TaskSubmissionItemsWrapper } from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsLoading } from 'components/Common/TaskSubmission/submission';
import Filters from 'components/GrantApplications/Filters';
import { RequestApproveButton } from 'components/organization/members/styles';
import { GET_GRANT_APPLICATIONS } from 'graphql/queries';
import { useEffect, useRef, useState } from 'react';
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import ListItem from '../ListItem';
import { LIMIT } from 'services/board';
import { useInView } from 'react-intersection-observer';

const Items = [
  {
    id: 1,
    title: 'Application 1',
    description: 'This is a description',

    createdAt: '2022-10-04T08:04:48.168815+00:00',
    commentCount: 4,
    orgId: '',
    podId: '',
    grantId: '',
    creator: {
      id: 1,
      username: 'lightsafeather',
      profilePicture: null,
    },
  },
  {
    id: 1,
    title: 'Application 1',
    description: 'This is a description',

    createdAt: '2022-10-04T08:04:48.168815+00:00',
    commentCount: 4,
    orgId: '',
    podId: '',
    grantId: '',
    creator: {
      id: 1,
      username: 'lightsafeather',
      profilePicture: null,
    },
  },
  {
    id: 1,
    title: 'Application 1',
    description: 'This is a description',

    createdAt: '2022-10-04T08:04:48.168815+00:00',
    commentCount: 4,
    orgId: '',
    podId: '',
    grantId: '',
    creator: {
      id: 1,
      username: 'lightsafeather',
      profilePicture: null,
    },
  },
  {
    id: 1,
    title: 'Application 1',
    description: 'This is a description',

    createdAt: '2022-10-04T08:04:48.168815+00:00',
    commentCount: 4,
    orgId: '',
    podId: '',
    grantId: '',
    creator: {
      id: 1,
      username: 'lightsafeather',
      profilePicture: null,
    },
  },
];

interface Application {
  id: string;
  createdAt?: string;
  grantId: string;
  createdBy: string;
  orgId: string;
  podId?: string;
  description?: string;
  commentCount?: number;
  creator: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  approvedAt?: string;
  changeRequestedAt?: string;
  rejectedAt?: string;
  paymentStatus?: string;
  additionalData?: any;
}

const List = () => {
  const { toggleCreateApplicationModal, grant } = useTaskContext();
  const [status, setStatus] = useState(GRANT_APPLICATION_STATUSES.OPEN);
  const [hasMore, setHasMore] = useState(false);
  const user = useMe();
  const [ref, inView] = useInView({});
  const { data, fetchMore, refetch, previousData } = useQuery(GET_GRANT_APPLICATIONS, {
    variables: {
      status,
      grantId: grant?.id,
    },
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantApplicationsForGrant?.length >= LIMIT;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
    skip: !grant?.id,
  });

  // const canApply = user && user?.id !== grant?.createdBy;

  const canApply = true;
  
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

  return (
    <>
      <TaskSubmissionsLoading loading={false} />

      <Grid container justifyContent="space-between" alignItems="center">
        <Filters setStatus={handleFilter} status={status} />
        {canApply && (
          <RequestApproveButton onClick={toggleCreateApplicationModal} data-cy="application-button">
            Apply for grant
          </RequestApproveButton>
        )}
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
