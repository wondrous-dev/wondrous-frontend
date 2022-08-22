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
      labelGradient: 'linear-gradient(180deg, #7427FF 0%, #F2C678 100%)',
      img: '/images/mission-control/contributor-card.png',
      hoverImg: '/images/mission-control/contributor-card-hover.png',
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
      labelGradient: 'linear-gradient(180deg, #00BAFF 0%, #F2C678 100%)',
      img: '/images/mission-control/operator-card.png',
      hoverImg: '/images/mission-control/operator-card-hover.png',
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
        {CARDS_CONFIG.workspace.map(({ label, labelGradient, img, stats, hoverImg }, idx) => (
          <MissionControlWorkspaceCard
            key={idx}
            label={label}
            labelGradient={labelGradient}
            hoverImg={hoverImg}
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
