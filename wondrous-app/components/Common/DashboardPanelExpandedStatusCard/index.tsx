import React from 'react';
import { useSelectMembership } from '../../../utils/hooks';
import { StyledBackground, Count, Status, CountIconWrapper, StyledBorder } from './styles';
import Tooltip from '../Popover';

const LABEL = {
  created: 'To-Do',
  inReview: 'In-Review',
  completed: 'Completed',
};
const DashboardPanelStatusCard = ({ status, selectedStatus, isAdmin, setSelectedStatus, dataKey }) => {
  const { count = 0, label = '', Icon, color, status: panelStatus } = status;
  const selectMembership = useSelectMembership();
  const handleOnClick = () => {
    if (label === 'memberships requests') {
      if (selectMembership?.setSelectMembershipRequests) {
        selectMembership?.setSelectMembershipRequests(true);
      }
    } else {
      selectMembership?.setSelectMembershipRequests(false);
    }
    if (selectedStatus === panelStatus) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(panelStatus);
    }
  };

  return (
    <StyledBorder color={color} isActive={selectedStatus === panelStatus} isAdmin={isAdmin} onClick={handleOnClick}>
      <StyledBackground>
        <CountIconWrapper>
          <Count color={color}>{count}</Count>
          <Tooltip content={LABEL[dataKey]} placement="bottom">
            <Icon />
          </Tooltip>
        </CountIconWrapper>
        <Status>{label}</Status>
      </StyledBackground>
    </StyledBorder>
  );
};

export default DashboardPanelStatusCard;
