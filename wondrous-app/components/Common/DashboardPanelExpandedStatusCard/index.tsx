import React from 'react';
import { StyledBackground, Count, Status, CountIconWrapper, StyledBorder } from './styles';

const DashboardPanelStatusCard = ({ status, selectedStatus, isAdmin, setSelectedStatus }) => {
  const { count = 0, label = '', Icon, color, status: panelStatus } = status;
  const handleOnClick = () => {
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
