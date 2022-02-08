import React from 'react';
import { Background, Count, Status, CountIconWrapper } from './styles';
import { Done } from '../../Icons';

const PanelStatusCard = ({ status }) => {
  const { count = 0, label = '', Icon, color } = status;
  console.log('color', color);
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

export default React.memo(PanelStatusCard);
