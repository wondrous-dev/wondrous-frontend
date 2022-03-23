import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import { withAuth } from '../components/Auth/withAuth';
import DashboardPanel from '../components/Common/DashboardPanel';
import Boards from '../components/Dashboard/boards';
import Wrapper from '../components/Dashboard/wrapper';
import { ViewType } from '../types/common';
import { SelectMembershipContext } from '../utils/contexts';

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
  const [selectMembershipRequests, setSelectMembershipRequests] = useState(false);
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;
  return (
    <Wrapper>
      <SelectMembershipContext.Provider
        value={{
          selectMembershipRequests,
          setSelectMembershipRequests,
        }}
      >
        <DashboardPanelWrapper>
          <DashboardPanel
            isAdmin={isAdmin}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setSelectMembershipRequests={setSelectMembershipRequests}
          />
        </DashboardPanelWrapper>
        <BoardsWrapper>
          <Boards
            isAdmin={isAdmin}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectMembershipRequests={selectMembershipRequests}
          />
        </BoardsWrapper>
      </SelectMembershipContext.Provider>
    </Wrapper>
  );
};

export default withAuth(Dashboard);
