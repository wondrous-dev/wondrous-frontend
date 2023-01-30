import { useQuery } from '@apollo/client';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { useTour } from '@reactour/tour';
import { useState, useLayoutEffect, useEffect } from 'react';
import {
  TodoIcon,
  InProgressIcon,
  InReviewIcon,
  CompletedIcon,
  AwaitingReview,
  OrgMemberships,
  PodMembershipsIcon,
  ProposalIcon,
} from 'components/Icons/statusIcons';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from 'graphql/queries/workflowBoards';
import {
  ORG_MEMBERSHIP_REQUESTS,
  POD_MEMBERSHIP_REQUESTS,
  TASK_STATUS_DONE,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_TODO,
} from 'utils/constants';
import ChooseEntityToCreate from 'components/CreateEntity';
import { useGetPerStatusTaskCountForUserBoard } from 'utils/hooks';
import { KudosWidget, MyProjectsWidget } from 'components/MissionControlWidgets';
import { ConnectWallet, Notifications } from 'components/MissionControlSidebarWidgets';
import HighlightedCone from 'components/Icons/HighlightedCone';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import {
  MissionControlWrapper,
  MissionControlSidebarWrapper,
  MissionControlWidgetsWrapper,
  MissionControlWidgetsContainer,
  MissionControlSidebarIconWrapper,
  FocusWrapper,
  ContributorGradient,
  OperatorGradient,
} from './styles';
import MissionControlWorkspaceCard from './WorkspaceCard';

const CARDS_CONFIG = {
  workspace: [
    {
      label: 'Your Contributor \n Workspace',
      url: '/dashboard',
      labelGradient: 'linear-gradient(180deg, #7427FF 0%, #F2C678 100%)',
      img: '/images/mission-control/contributor-card.png',
      hoverImg: '/images/mission-control/contributor-card-hover.png',
      gradient: ContributorGradient,
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
      label: 'Your Operator \n Workspace',
      labelGradient: 'linear-gradient(180deg, #00BAFF 0%, #F2C678 100%)',
      img: '/images/mission-control/operator-card.png',
      hoverImg: '/images/mission-control/operator-card-hover.png',
      gradient: OperatorGradient,
      url: `/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`,
      stats: [
        {
          icon: OrgMemberships,
          key: 'orgMembershipRequestCount',
          label: 'Org Membership requests',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #FF6DD7 90.48%)',
          url: `/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`,
        },
        {
          icon: PodMembershipsIcon,
          key: 'podMembershipRequestCount',
          label: 'Pod Membership requests',
          countGradient: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #FF6DD7 90.48%)',
          url: `/dashboard/admin?boardType=${POD_MEMBERSHIP_REQUESTS}`,
        },
        {
          icon: ProposalIcon,
          key: 'proposalRequestCount',
          label: 'Proposals',
          countGradient: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
          url: `/dashboard/admin?boardType=${TASK_STATUS_PROPOSAL_REQUEST}`,
        },
        {
          icon: AwaitingReview,
          key: 'submissionRequestCount',
          label: 'Awaiting review',
          countGradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
          url: `/dashboard/admin?boardType=${TASK_STATUS_SUBMISSION_REQUEST}`,
        },
      ],
    },
  ],
};

const MissionControl = () => {
  const user = useMe();

  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    if (user && !user?.lastCompletedGuide) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user, user?.lastCompletedGuide]);
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
      <ChooseEntityToCreate />
      <TaskViewModalWatcher />
      <MissionControlWidgetsWrapper>
        {CARDS_CONFIG.workspace.map(({ label, labelGradient, img, stats, hoverImg, gradient, url }, idx) => (
          <MissionControlWorkspaceCard
            key={idx}
            label={label}
            url={url}
            labelGradient={labelGradient}
            hoverImg={hoverImg}
            img={img}
            gradient={gradient}
            stats={generateCountForStats(stats)}
          />
        ))}
        <MissionControlWidgetsContainer>
          <KudosWidget />
          <Notifications />
        </MissionControlWidgetsContainer>
      </MissionControlWidgetsWrapper>
      <MissionControlSidebarWrapper>
        <ConnectWallet />
        <FocusWrapper>
          <MyProjectsWidget />
        </FocusWrapper>
        <MissionControlSidebarIconWrapper>
          <HighlightedCone />
        </MissionControlSidebarIconWrapper>
      </MissionControlSidebarWrapper>
    </MissionControlWrapper>
  );
};

export default withAuth(MissionControl);
