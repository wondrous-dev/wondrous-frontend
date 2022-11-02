import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import { OrgBoardContext } from 'utils/contexts';
import { useGetOrgFromUsername, useGlobalContext } from 'utils/hooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import Wrapper from 'components/organization/wrapper/wrapper';
import GrantsBoard from 'components/GrantsBoard';

const GrantsPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const org = useGetOrgFromUsername(username);
  const { userPermissionsContext } = useGlobalContext();
  return (
    <OrgBoardContext.Provider
      value={{
        orgId: org?.id,
        orgData: org,
        userPermissionsContext,
      }}
    >
      <EntitySidebar>
        <Wrapper orgData={org} onSearch={() => {}}>
          <GrantsBoard />
        </Wrapper>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};
export default GrantsPage;
