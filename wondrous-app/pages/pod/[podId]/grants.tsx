import { useQuery } from '@apollo/client';
import EntitySidebar from 'components/Common/SidebarEntity';
import GrantsBoard from 'components/GrantsBoard';
import Wrapper from 'components/Pod/wrapper';
import { GET_POD_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PodBoardContext } from 'utils/contexts';
import { useGetPodById, useGlobalContext, usePageDataContext, usePodPageFetch } from 'utils/hooks';

const GrantsPage = () => {
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
        <Wrapper>
          <GrantsBoard />
        </Wrapper>
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
};
export default GrantsPage;
