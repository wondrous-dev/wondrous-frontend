import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { withAuth } from 'components/Auth/withAuth';
import Boards from 'components/Dashboard/boards';
import Wrapper from 'components/Dashboard/wrapper';
import { ViewType } from 'types/common';
import { SelectMembershipContext } from 'utils/contexts';
import { BoardsWrapper } from 'components/Dashboard/boards/styles';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectMembershipRequests, setSelectMembershipRequests] = useState(false);
  const router = useRouter();
  const isAdmin = router.query.view === ViewType.Admin;
  const isMobile = useIsMobile();

  return (
    <Wrapper isAdmin={isAdmin}>
      {isMobile ? <MobileComingSoonModal /> : null}
      <SelectMembershipContext.Provider
        value={{
          selectMembershipRequests,
          setSelectMembershipRequests,
        }}
      >
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
