import { useQuery } from '@apollo/client';
import { useTour } from '@reactour/tour';
import { useMe } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import HomePageHeader from 'components/organization/wrapper/HomePageHeader';
import ProjectProfile from 'components/ProjectProfile';
import { GET_ORG_FROM_USERNAME, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { OrgBoardContext } from 'utils/contexts';
import { usePageDataContext } from 'utils/hooks';

const OrgProject = () => {
  const router = useRouter();
  const { username } = router.query;
  const user = useMe();
  const { setIsOpen, setCurrentStep } = useTour();
  const { setPageData } = usePageDataContext();
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const { data } = useQuery(GET_ORG_FROM_USERNAME, {
    skip: !username,
    variables: {
      username,
    },
  });
  const { getOrgFromUsername: orgData } = data || {};

  useEffect(() => {
    if (orgData) {
      setPageData({ orgData });
    }
  }, [orgData]);

  useEffect(() => () => setPageData({}), []);

  useEffect(() => {
    if (user && !user?.projectGuideComplete) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user]);
  const contextValue = useMemo(
    () => ({
      userPermissionsContext: userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null,
      orgData,
      orgId: orgData?.id,
      isHomepage: true,
    }),
    [orgData, userPermissionsContext]
  );

  return (
    <OrgBoardContext.Provider value={contextValue}>
      <EntitySidebar>
        <HomePageHeader orgData={orgData}>
          <ProjectProfile />
        </HomePageHeader>
      </EntitySidebar>
    </OrgBoardContext.Provider>
  );
};

export default OrgProject;
