import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Image from 'next/legacy/image';

import { UserProfileContext } from 'utils/contexts';
import useGetUserProfile from 'hooks/useGetUserProfile';

import ProfileInfo from 'components/ProfileInfo';
import ProfileUserTaskDaos from 'components/ProfileUserTaskDaos';

import TaskViewModal from 'components/Common/TaskViewModal';
import { useLocation } from 'utils/useLocation';
import { delQuery } from 'utils/index';
import { enableContainerOverflow } from 'utils/helpers';
import { useEffect, useState } from 'react';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { UserProfileContainerWrapper, UserProfileHeaderImageWrapper, UserProfileContainerContent } from './styles';

function UserProfileContainer() {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfileData = useGetUserProfile(routerId, username);
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const taskId = (location?.params?.task || location?.params.taskProposal)?.toString();
  const handleClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[2]));
    }
    const newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    enableContainerOverflow();
    setOpenModal(false);
  };

  useEffect(() => {
    const { params } = location;
    if (params.task || params.taskProposal) {
      setOpenModal(true);
    }
  }, [location]);

  return (
    <UserProfileContext.Provider
      value={{
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={handleClose}
        taskId={taskId}
        isTaskProposal={!!location?.params?.taskProposal}
      />
      <UserProfileContainerWrapper>
        <UserProfileHeaderImageWrapper>
          <Image src="/images/profile/profileBackground.png" layout="fill" objectFit="cover" alt="header-image" />
        </UserProfileHeaderImageWrapper>
        <UserProfileContainerContent>
          <ProfileInfo userProfile={userProfileData} />
          <ProfileUserTaskDaos userProfile={userProfileData} />
        </UserProfileContainerContent>
      </UserProfileContainerWrapper>
    </UserProfileContext.Provider>
  );
}

export default withAuth(UserProfileContainer);
