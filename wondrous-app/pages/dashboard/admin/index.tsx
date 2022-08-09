import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Wrapper from 'components/Dashboard/wrapper';
import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import { useIsMobile } from 'utils/hooks';
import { ADMIN_PAGE_TYPES } from 'utils/constants';
import AdminBoard from 'components/Dashboard/admin';
import { UserBoardContext } from 'utils/contexts';
import { useQuery } from '@apollo/client';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from 'graphql/queries/workflowBoards';

const AdminDashboard = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { data: adminWorkflowCount } = useQuery(GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const queryBoardType: any = router?.query?.boardType;

  const type = ADMIN_PAGE_TYPES[queryBoardType]?.type;

  useEffect(() => {
    console.log('mounted1');
  }, []);
  return (
    <Wrapper isAdmin>
      <UserBoardContext.Provider
        value={{
          searchLabel: 'Search tasks or people...',
          adminWorkflowCount: adminWorkflowCount?.getWorkFlowBoardReviewableItemsCount,
        }}
      >
        {isMobile ? <MobileComingSoonModal /> : null}
        {type ? <AdminBoard type={type} /> : null}
      </UserBoardContext.Provider>
    </Wrapper>
  );
};

export default withAuth(AdminDashboard);
