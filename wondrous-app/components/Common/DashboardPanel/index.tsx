import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD } from '../../../graphql/queries';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from '../../../graphql/queries/workflowBoards';
import { AwaitingPayment, DoneWithBorder } from '../../Icons';
import { InReviewIcon, ProposalsRemainingIcon, TodoIcon } from '../../Icons/statusIcons';
import DashboardPanelExpanded from '../DashboardPanelExpanded';
import DashboardPanelSticky from '../DashboardPanelSticky';
import { useInView } from 'react-intersection-observer';
import { DashboardPanelWrapper } from './styles';
import {
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_PROPOSAL_REQUEST,
  TASK_STATUS_SUBMISSION_REQUEST,
} from '../../../utils/constants';

const panels = { contributor: 'Contributor', admin: 'Admin' };

const statusCardsBase = [
  {
    Icon: TodoIcon,
    label: 'tasks left to do',
    color: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
    panelPosition: 1,
    panel: panels.contributor,
    dataKey: 'created',
  },
  {
    Icon: InReviewIcon,
    label: 'tasks in-review',
    color: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
    panelPosition: 2,
    panel: panels.contributor,
    dataKey: 'inReview',
  },
  {
    Icon: DoneWithBorder,
    label: 'tasks completed',
    color: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
    panelPosition: 3,
    panel: panels.contributor,
    dataKey: 'completed',
  },
  // NOTE: Per Andros instruction, the membership request feature is not yet implement so this panel should not be displayed for now
  // {
  //   Icon: MembershipRequestIcon,
  //   label: 'memberships requests',
  //   color: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #FF6DD7 90.48%)',
  //   panelPosition: 1,
  //   panel: panels.admin,
  //   dataKey: 'orgMembershipRequestCount',
  // },
  {
    Icon: ProposalsRemainingIcon,
    label: 'proposals remaining',
    color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
    panelPosition: 2,
    panel: panels.admin,
    dataKey: 'proposalRequestCount',
    status: TASK_STATUS_PROPOSAL_REQUEST,
  },
  {
    Icon: InReviewIcon,
    label: 'tasks to review',
    color: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
    panelPosition: 3,
    panel: panels.admin,
    dataKey: 'submissionRequestCount',
    status: TASK_STATUS_SUBMISSION_REQUEST,
  },
  // NOTE: Per Terry's instruction, payments will be hidden for now from the Admin View
  // {
  //   Icon: AwaitingPayment,
  //   label: 'tasks awaiting payment',
  //   color: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
  //   panelPosition: 4,
  //   panel: panels.admin,
  //   dataKey: 'paymentRequestCount',
  //   status: TASK_STATUS_AWAITING_PAYMENT,
  // },
];

const updateStatusCards = (data, statusData, panel) => {
  return statusData
    .filter((i) => panel === i.panel)
    .map((status) => {
      return {
        ...status,
        count: data?.[status?.dataKey] ?? 0,
      };
    })
    .sort((a, b) => a.panelPosition - b.panelPosition);
};

const DashboardPanel = (props) => {
  const { isAdmin, setIsAdmin, selectedStatus, setSelectedStatus } = props;
  const [ref, inView] = useInView({});
  const { data: getPerStatusTaskCountData, loading: getPerStatusTaskCountLoading } = useQuery(
    GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD // BUG: @ There seems to be an error with the total tasks in-review
  );
  const { data: getWorkFlowBoardReviewableItemsCountData, loading: getWorkFlowBoardReviewableItemsCountLoading } =
    useQuery(GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT);
  const activePanel = isAdmin ? panels.admin : panels.contributor;
  const activePanelData = isAdmin
    ? getWorkFlowBoardReviewableItemsCountData?.getWorkFlowBoardReviewableItemsCount
    : getPerStatusTaskCountData?.getPerStatusTaskCountForUserBoard;
  const activePanelStatusCards = updateStatusCards(activePanelData, statusCardsBase, activePanel);

  return (
    <DashboardPanelWrapper>
      {!inView && (
        <DashboardPanelSticky
          activePanelStatusCards={activePanelStatusCards}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          isAdmin={isAdmin}
        />
      )}
      <DashboardPanelExpanded
        activePanel={activePanel}
        activePanelStatusCards={activePanelStatusCards}
        onClick={() => setIsAdmin((prevState) => !prevState)}
        loading={getPerStatusTaskCountLoading || getWorkFlowBoardReviewableItemsCountLoading}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        isAdmin={isAdmin}
      />
      <span ref={ref} />
    </DashboardPanelWrapper>
  );
};

export default React.memo(DashboardPanel);
