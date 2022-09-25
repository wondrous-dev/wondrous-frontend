import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { ViewType } from 'types/common';
import { delQuery } from 'utils';
import AndroidSwitch from 'components/Common/AndroidSwitch';
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

function DashboardPanelExpanded(props) {
  const {
    activePanel,
    loading,
    activePanelStatusCards,
    selectedStatus,
    setSelectedStatus,
    isAdmin,
    setSelectMembershipRequests,
  } = props;
  const router = useRouter();
  const handleOnClick = () => {
    router.query.view !== ViewType.Admin
      ? router.replace(`${delQuery(router.asPath)}?view=${ViewType.Admin}`)
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
}

export default React.memo(DashboardPanelExpanded);
