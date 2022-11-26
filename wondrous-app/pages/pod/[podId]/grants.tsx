import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import { PodBoardContext } from 'utils/contexts';
import { useGetOrgFromUsername, useGetPodById, useGlobalContext } from 'utils/hooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import GrantsBoard from 'components/GrantsBoard';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import Wrapper from 'components/Pod/wrapper';

const GrantsPage = () => {
  const router = useRouter();
  const { podId } = router.query;
  const getPodById = useGetPodById(podId);
  const { userPermissionsContext } = useGlobalContext();
  return (
    <PodBoardContext.Provider
      value={{
        pod: getPodById,
        podId,
        orgId: getPodById?.orgId,
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
