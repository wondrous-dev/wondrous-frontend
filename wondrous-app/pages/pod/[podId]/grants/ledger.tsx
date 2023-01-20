import { useQuery } from '@apollo/client';
import EntitySidebar from 'components/Common/SidebarEntity';
import GrantsBoard from 'components/GrantsBoard';
import BoardPageHeader from 'components/Pod/wrapper/BoardPageHeader';
import { GET_POD_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodById, useGlobalContext, usePageDataContext, usePodPageFetch } from 'utils/hooks';

const GrantsLedgerPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const { userPermissionsContext } = useGlobalContext();

  const { data } = usePodPageFetch(podId);

  return (
    <PodBoardContext.Provider
      value={{
        pod: data?.getPodById,
        podId,
        orgId: data?.getPodById?.orgId,
        userPermissionsContext,
      }}
    >
      <EntitySidebar>
        <BoardPageHeader headerTitle="Grants">
          <GrantsBoard />
        </BoardPageHeader>
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
};
export default GrantsLedgerPage;
