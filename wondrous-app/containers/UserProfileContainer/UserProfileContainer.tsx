import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Image from 'next/image';

import { UserProfileContext } from 'utils/contexts';
import useGetUserProfile from 'hooks/useGetUserProfile';

import ProfileInfo from 'components/ProfileInfo';
import ProfileUserTaskDaos from 'components/ProfileUserTaskDaos';

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

  return (
    <UserProfileContext.Provider
      value={{
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <TaskViewModalWatcher />
      <UserProfileContainerWrapper>
        <UserProfileHeaderImageWrapper>
          <Image
            src="/images/profile/profileBackground.png"
            fill
            style={{
              objectFit: 'cover',
            }}
            alt="header-image"
          />
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
