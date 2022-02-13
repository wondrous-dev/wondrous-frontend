import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { AndroidSwitch } from '../../CreateEntity/createEntityModal';
import DashboardPanelStatusCard from '../DashboardPanelExpandedStatusCard';
import {
  CircularProgressWrapper,
  DashboardPanelStatusCardWrapper,
  HeaderTitle,
  PanelHeader,
  PanelViewButton,
  PanelViewButtonLabel,
  StyledBackground,
  StyledBorder,
} from './styles';

const DashboardPanelExpanded = (props) => {
  const { activePanel, onClick, loading, activePanelStatusCards, selectedStatus, setSelectedStatus, isAdmin } = props;
  return (
    <StyledBorder>
      <StyledBackground>
        <PanelHeader>
          <HeaderTitle>{activePanel} panel</HeaderTitle>
          <PanelViewButton>
            <PanelViewButtonLabel>Admin View</PanelViewButtonLabel>
            <AndroidSwitch onClick={onClick} />
          </PanelViewButton>
        </PanelHeader>
        {loading ? (
          <CircularProgressWrapper>
            <CircularProgress />
          </CircularProgressWrapper>
        ) : (
          <DashboardPanelStatusCardWrapper>
            {activePanelStatusCards.map((status) => (
              <DashboardPanelStatusCard
                key={status.panelPosition}
                status={status}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                isAdmin={isAdmin}
              />
            ))}
          </DashboardPanelStatusCardWrapper>
        )}
      </StyledBackground>
    </StyledBorder>
  );
};

export default React.memo(DashboardPanelExpanded);
