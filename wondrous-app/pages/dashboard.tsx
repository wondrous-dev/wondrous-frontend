import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import { withAuth } from '../components/Auth/withAuth';
import DashboardPanel from '../components/Common/DashboardPanel';
import Boards from '../components/Dashboard/boards';
import Wrapper from '../components/Dashboard/wrapper';
import { ViewType } from '../types/common';

const DashboardPanelWrapper = styled.div`
  margin-top: -140px;
  width: 100%;
`;

const BoardsWrapper = styled.div`
  width: 1037px;
  margin: 0 auto;
`;

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;
  return (
    <Wrapper>
      <DashboardPanelWrapper>
        <DashboardPanel isAdmin={isAdmin} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
      </DashboardPanelWrapper>
      <BoardsWrapper>
        <Boards isAdmin={isAdmin} selectedStatus={selectedStatus} />
      </BoardsWrapper>
    </Wrapper>
  );
};

export default withAuth(Dashboard);
