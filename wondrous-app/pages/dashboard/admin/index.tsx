import React from 'react';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Wrapper from 'components/Dashboard/wrapper';
import AdminBoard from 'components/Dashboard/admin';
import { UserBoardContext } from 'utils/contexts';
import { useQuery } from '@apollo/client';
import { GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT } from 'graphql/queries/workflowBoards';

const AdminDashboard = () => {
  const router = useRouter();

  const { data: adminWorkflowCount } = useQuery(GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const queryBoardType: any = router?.query?.boardType;

  return (
    <Wrapper isAdmin>
      <UserBoardContext.Provider
        value={{
          searchLabel: 'Search tasks or people...',
          adminWorkflowCount: adminWorkflowCount?.getWorkFlowBoardReviewableItemsCount,
          enableViewSwitcher: true,
        }}
      >
        {queryBoardType ? <AdminBoard type={queryBoardType} /> : null}
      </UserBoardContext.Provider>
    </Wrapper>
  );
};

export default withAuth(AdminDashboard);
