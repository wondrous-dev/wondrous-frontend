import { useQuery } from '@apollo/client';
import { useTour } from '@reactour/tour';
import { useMe } from 'components/Auth/withAuth';
import EntitySidebar from 'components/Common/SidebarEntity';
import GrantApplicationPodCreateModal from 'components/GrantApplications/GrantApplicationPodCreateModal';
import HomePageHeader from 'components/Pod/wrapper/HomePageHeader';
import ProjectProfile from 'components/ProjectProfile';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { PodBoardContext } from 'utils/contexts';
import { usePageDataContext } from 'utils/hooks';

const PodProject = () => {
  const { podId } = useRouter().query;
  const { setPageData } = usePageDataContext();
  const { setIsOpen, setCurrentStep } = useTour();
  const user = useMe();
  const { data } = useQuery(GET_POD_BY_ID, {
    skip: !podId,
    variables: {
      podId,
    },
    onCompleted: ({ getPodById }) => {
      setPageData({ pod: getPodById });
    },
  });
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  useEffect(() => () => setPageData({}), []);
  useEffect(() => {
    if (user && !user?.projectGuideComplete) {
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, [user]);
  const { getPodById } = data || {};

  const contextValue = useMemo(
    () => ({
      userPermissionsContext: userPermissionsContext?.getUserPermissionContext
        ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
        : null,
      orgId: getPodById?.orgId,
      pod: getPodById,
      podId: getPodById?.id,
      isHomepage: true,
    }),
    [getPodById, userPermissionsContext]
  );

  return (
    <PodBoardContext.Provider value={contextValue}>
      <GrantApplicationPodCreateModal />

      <EntitySidebar>
        <HomePageHeader>
          <ProjectProfile />
        </HomePageHeader>
      </EntitySidebar>
    </PodBoardContext.Provider>
  );
};

export default PodProject;
