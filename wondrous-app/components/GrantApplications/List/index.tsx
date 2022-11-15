import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import { TaskSubmissionItemsWrapper } from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsLoading } from 'components/Common/TaskSubmission/submission';
import Filters from 'components/GrantApplications/Filters';
import { RequestApproveButton } from 'components/organization/members/styles';
import { GET_GRANT_APPLICATIONS } from 'graphql/queries';
import { useState } from 'react';
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';
import ListItem from '../ListItem';

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
  const [status, setStatus] = useState(GRANT_APPLICATION_STATUSES.OPEN)
  const {} = useQuery(GET_GRANT_APPLICATIONS, {
    variables: {
      status,
      grantId: grant?.id
    },
    skip: !grant?.id
  })
  return (
    <>
      <TaskSubmissionsLoading loading={false} />

      <Grid container justifyContent="space-between" alignItems="center">
        <Filters setStatus={setStatus} status={status}/>
        <RequestApproveButton onClick={toggleCreateApplicationModal} data-cy="application-button">
          Apply for grant
        </RequestApproveButton>
      </Grid>
      <TaskSubmissionItemsWrapper data-cy="item-submission">
        {Items.map((item, idx) => (
          <ListItem key={item.id + idx} item={item} />
        ))}
      </TaskSubmissionItemsWrapper>
    </>
  );
};

export default List;
