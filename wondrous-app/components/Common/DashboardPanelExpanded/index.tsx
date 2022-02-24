import { CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { delQuery } from '../../../utils';
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

const adminView = 'admin';

const DashboardPanelExpanded = (props) => {
  const { activePanel, loading, activePanelStatusCards, selectedStatus, setSelectedStatus, isAdmin } = props;
  const router = useRouter();
  const handleOnClick = () => {
    router.query.view !== adminView
      ? router.replace(`${delQuery(router.asPath)}?view=${adminView}`)
      : router.replace(`${delQuery(router.asPath)}`);
  };
  return (
    <StyledBorder>
      <StyledBackground>
        <PanelHeader>
          <HeaderTitle>{activePanel} panel</HeaderTitle>
          <PanelViewButton>
            <PanelViewButtonLabel>Admin View</PanelViewButtonLabel>
            <AndroidSwitch onClick={handleOnClick} checked={isAdmin} />
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
