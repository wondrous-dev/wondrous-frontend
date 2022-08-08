import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import DashboardPanel from 'components/Common/DashboardPanel';
import Boards from 'components/Dashboard/boards';
import Wrapper from 'components/Dashboard/wrapper';
import { ViewType } from 'types/common';
import { SelectMembershipContext } from 'utils/contexts';
import { DashboardPanelWrapper, BoardsWrapper } from 'components/Dashboard/boards/styles';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectMembershipRequests, setSelectMembershipRequests] = useState(false);
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;
  const isMobile = useIsMobile();

  return (
    <Wrapper>
      {isMobile ? <MobileComingSoonModal /> : null}
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
