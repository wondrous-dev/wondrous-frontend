import React, { useState } from 'react';
import { withAuth } from '../components/Auth/withAuth';
import Boards from '../components/Dashboard/boards';
import DashboardPanel from '../components/Common/DashboardPanel';
import Wrapper from '../components/Dashboard/wrapper';
import styled from 'styled-components';

const DashboardPanelWrapper = styled.div`
  margin-top: -140px;
  width: 100%;
`;

const BoardsWrapper = styled.div`
  width: 1037px;
  margin: 0 auto;
`;

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  return (
    <Wrapper>
      <DashboardPanelWrapper>
        <DashboardPanel
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </DashboardPanelWrapper>
      <BoardsWrapper>
        <Boards isAdmin={isAdmin} selectedStatus={selectedStatus} />
      </BoardsWrapper>
    </Wrapper>
  );
};

export default withAuth(Dashboard);
