import React from 'react';
import { withAuth } from '../components/Auth/withAuth';
import Boards from '../components/Dashboard/boards';
import DashboardPanel from '../components/Common/DashboardPanel';
import { DashboardPanelWrapper } from '../components/Dashboard/styles';
import Wrapper from '../components/Dashboard/wrapper';

const Dashboard = () => {
  return (
    <Wrapper>
      <DashboardPanelWrapper>
        <DashboardPanel />
      </DashboardPanelWrapper>
      <Boards />
    </Wrapper>
  );
};

export default withAuth(Dashboard);
