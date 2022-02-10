import React from 'react';
import { Background, Count, Status, CountIconWrapper } from './styles';

const DashboardPanelStatusCard = ({ status }) => {
  const { count = 0, label = '', Icon, color } = status;
  return (
    <Background>
      <CountIconWrapper>
        <Count color={color}>{count}</Count>
        <Icon />
      </CountIconWrapper>
      <Status>{label}</Status>
    </Background>
  );
};

export default DashboardPanelStatusCard;
