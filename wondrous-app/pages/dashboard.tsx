import React from 'react';
import { withAuth } from '../components/Auth/withAuth';
import Boards from '../components/Dashboard/boards';
import DashboardPanel from '../components/Common/DashboardPanel';
import Wrapper from '../components/Dashboard/wrapper';
import styled from 'styled-components';

const DashboardPanelWrapper = styled.div`
  margin-top: -140px;
`;

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
