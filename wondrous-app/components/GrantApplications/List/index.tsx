import { Grid } from '@mui/material';
import { TaskSubmissionItemsWrapper } from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsLoading } from 'components/Common/TaskSubmission/submission';
import Filters from 'components/GrantApplications/Filters';
import { RequestApproveButton } from 'components/organization/members/styles';
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

const List = ({ grantId }) => {
  const handleCreateApplication = () => {};
  return (
    <>
      <TaskSubmissionsLoading loading={false} />
      <Grid container justifyContent="space-between" alignItems="center">
        <Filters />
        <RequestApproveButton onClick={handleCreateApplication} data-cy="application-button">
          Create Application
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
