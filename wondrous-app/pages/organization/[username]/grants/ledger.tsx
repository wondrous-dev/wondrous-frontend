import { useRouter } from 'next/router';
import { OrgBoardContext } from 'utils/contexts';
import { useGetOrgFromUsername, useGlobalContext, usePageDataContext } from 'utils/hooks';
import EntitySidebar from 'components/Common/SidebarEntity';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import GrantPaymentsLedger from 'components/GrantPaymentsLedger';
import { useEffect } from 'react';

const GrantsLedgerPage = () => {
  const router = useRouter();
  const { setPageData } = usePageDataContext();
  const { username } = router.query;
  const org = useGetOrgFromUsername(username);
  useEffect(() => {
    if (org) {
      setPageData({ orgData: org });
    }
  }, [org]);

  useEffect(() => () => setPageData({}), []);

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
        <BoardPageHeader orgData={org} onSearch={() => {}} headerTitle="Grants">
          <GrantPaymentsLedger />
        </BoardPageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};
export default GrantsLedgerPage;
