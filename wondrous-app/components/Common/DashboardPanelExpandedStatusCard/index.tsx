import React from 'react';
import { useSelectMembership } from 'utils/hooks';
import { StyledBackground, Count, Status, CountIconWrapper, StyledBorder } from './styles';

const DashboardPanelStatusCard = ({ status, selectedStatus, isAdmin, setSelectedStatus }) => {
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
          <Icon />
        </CountIconWrapper>
        <Status>{label}</Status>
      </StyledBackground>
    </StyledBorder>
  );
};

export default DashboardPanelStatusCard;
