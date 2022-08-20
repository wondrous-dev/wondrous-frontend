import { useQuery } from '@apollo/client';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { TodoIcon, InProgressIcon, InReviewIcon, CompletedIcon } from 'components/Icons/statusIcons';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from 'graphql/queries/workflowBoards';
import {
  ORG_MEMBERSHIP_REQUESTS,
  POD_MEMBERSHIP_REQUESTS,
  TASK_STATUS_DONE,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';
import { KudosWidget, InProgressTasksWidget } from 'components/MissionControlWidgets';
import { ConnectWallet, Notifications } from 'components/MissionControlSidebarWidgets';
import {
  MissionControlWrapper,
  MissionControlSidebarWrapper,
  MissionControlWidgetsWrapper,
  MissionControlWidgetsContainer,
} from './styles';
import MissionControlWorkspaceCard from './WorkspaceCard';

const CARDS_CONFIG = {
  workspace: [
    {
      label: 'Contributor \n Workspace',
      labelGradient: 'linear-gradient(88.95deg, #F93701 1.8%, #FFD653 35.94%, #00BAFF 66.57%, #06FFA5 93.68%)',
      img: 'https://images.unsplash.com/photo-1660517955652-43820f5723d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=814&q=80',
      stats: [
        {
          icon: TodoIcon,
          key: TASK_STATUS_TODO,
          label: 'To-do',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
          url: '/dashboard',
        },
        {
          icon: InProgressIcon,
          key: 'inProgress',
          label: 'In Progress',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
          url: '/dashboard',
        },
        {
          icon: InReviewIcon,
          key: 'inReview',
          label: 'In Review',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
          url: '/dashboard',
        },
        {
          icon: CompletedIcon,
          key: TASK_STATUS_DONE,
          label: 'Completed',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
          url: '/dashboard',
        },
      ],
    },
    {
      label: 'Operator \n Workspace',
      labelGradient: 'linear-gradient(88.95deg, #FF6ED8 1.8%, #BD2FFF 35.94%, #00BAFF 66.57%, #06FFA5 93.68%)',
      img: 'https://images.unsplash.com/photo-1660517955652-43820f5723d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=814&q=80',
      stats: [
        {
          icon: TodoIcon,
          key: 'orgMembershipRequestCount',
          label: 'Org Membership requests',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
          url: `/dashboard/admin/${ORG_MEMBERSHIP_REQUESTS}`,
        },
        {
          icon: TodoIcon,
          key: 'podMembershipRequestCount',
          label: 'Pod Membership requests',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
          url: `/dashboard/admin/${POD_MEMBERSHIP_REQUESTS}`,
        },
        {
          icon: InProgressIcon,
          key: 'proposalRequestCount',
          label: 'Proposals',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFD653 100%)',
          url: `/dashboard/admin/${TASK_STATUS_PROPOSAL_REQUEST}`,
        },
        {
          icon: InReviewIcon,
          key: 'submissionRequestCount',
          label: 'Awaiting review',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
          url: `/dashboard/admin/${TASK_STATUS_SUBMISSION_REQUEST}`,
        },
      ],
    },
  ],
};

const MissionControl = () => {
  const user = useMe();
  const { data: adminWorkflowCount, loading: workflowCountLoading } = useQuery(
    GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    }
  );

  const { data: userTaskCountData, loading: taskCountLoading } = useGetPerStatusTaskCountForUserBoard(user?.id);

  const generateCountForStats = (stats) =>
    stats.map((stat) => {
      const count =
        {
          ...adminWorkflowCount?.getWorkFlowBoardReviewableItemsCount,
          ...userTaskCountData?.getPerStatusTaskCountForUserBoard,
        }[stat.key] || 0;
      return { ...stat, count };
    });

  return (
    <MissionControlWrapper>
      <MissionControlWidgetsWrapper>
        {CARDS_CONFIG.workspace.map(({ label, labelGradient, img, stats }, idx) => (
          <MissionControlWorkspaceCard
            key={idx}
            label={label}
            labelGradient={labelGradient}
            img={img}
            stats={generateCountForStats(stats)}
          />
        ))}
        <MissionControlWidgetsContainer>
          <KudosWidget />
          <InProgressTasksWidget />
        </MissionControlWidgetsContainer>
      </MissionControlWidgetsWrapper>
      <MissionControlSidebarWrapper>
        <ConnectWallet />
        <Notifications />
      </MissionControlSidebarWrapper>
    </MissionControlWrapper>
  );
};

export default withAuth(MissionControl);
