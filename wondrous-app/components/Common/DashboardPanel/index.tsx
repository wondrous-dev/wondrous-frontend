import { useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD } from '../../../graphql/queries';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from '../../../graphql/queries/workflowBoards';
import { AndroidSwitch } from '../../CreateEntity/createEntityModal';
import { AwaitingPayment, DoneWithBorder } from '../../Icons';
import { InReviewIcon, MembershipRequestIcon, ProposalsRemainingIcon, TodoIcon } from '../../Icons/statusIcons';
import DashboardPanelStatusCard from '../DashboardPanelStatusCard';
import {
  CircularProgressWrapper,
  HeaderTitle,
  PanelHeader,
  DashboardPanelStatusCardWrapper,
  PanelViewButton,
  PanelViewButtonLabel,
  StyledBackground,
  StyledBorder,
} from './styles';

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
  {
    Icon: MembershipRequestIcon,
    label: 'memberships requests',
    color: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #FF6DD7 90.48%)',
    panelPosition: 1,
    panel: panels.admin,
    dataKey: 'orgMembershipRequestCount',
  },
  {
    Icon: ProposalsRemainingIcon,
    label: 'proposals remaining',
    color: 'linear-gradient(46.92deg, #B820FF 8.72%, #FFFFFF 115.55%)',
    panelPosition: 2,
    panel: panels.admin,
    dataKey: 'proposalRequestCount',
  },
  {
    Icon: InReviewIcon,
    label: 'tasks to review',
    color: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
    panelPosition: 3,
    panel: panels.admin,
    dataKey: 'submissionRequestCount',
  },
  {
    Icon: AwaitingPayment,
    label: 'tasks awaiting payment',
    color: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
    panelPosition: 4,
    panel: panels.admin,
    dataKey: 'paymentRequestCount',
  },
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
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: getPerStatusTaskCountData, loading: getPerStatusTaskCountLoading } = useQuery(
    GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD
  );
  const { data: getWorkFlowBoardReviewableItemsCountData, loading: getWorkFlowBoardReviewableItemsCountLoading } =
    useQuery(GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT);
  const activePanel = isAdmin ? panels.admin : panels.contributor;
  const activePanelData = isAdmin
    ? getWorkFlowBoardReviewableItemsCountData?.getWorkFlowBoardReviewableItemsCount
    : getPerStatusTaskCountData?.getPerStatusTaskCountForUserBoard;
  const activePanelStatusCards = updateStatusCards(activePanelData, statusCardsBase, activePanel);
  const handleSwitchOnClick = useCallback(() => {
    setIsAdmin((prevState) => !prevState);
  }, []);
  return (
    <StyledBorder>
      <StyledBackground>
        <PanelHeader>
          <HeaderTitle>{activePanel} panel</HeaderTitle>
          <PanelViewButton>
            <PanelViewButtonLabel>Admin View</PanelViewButtonLabel>
            <AndroidSwitch onClick={handleSwitchOnClick} />
          </PanelViewButton>
        </PanelHeader>
        {getPerStatusTaskCountLoading || getWorkFlowBoardReviewableItemsCountLoading ? (
          <CircularProgressWrapper>
            <CircularProgress />
          </CircularProgressWrapper>
        ) : (
          <DashboardPanelStatusCardWrapper>
            {activePanelStatusCards.map((status, id) => (
              <DashboardPanelStatusCard key={id} status={status} />
            ))}
          </DashboardPanelStatusCardWrapper>
        )}
      </StyledBackground>
    </StyledBorder>
  );
};

export default React.memo(DashboardPanel);
