import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Image from 'next/image';

import { UserProfileContext } from 'utils/contexts';
import useGetUserProfile from 'hooks/useGetUserProfile';

import ProfileInfo from 'components/UserProfile/ProfileInfo';
import ProfileUserTaskDaos from 'components/UserProfile/ProfileUserTaskDaos';
import { HEADER_ASPECT_RATIO } from 'utils/constants';
import { SafeImage } from 'components/Common/Image';
import DEFAULT_HEADER from 'public/images/profile/profileBackground.png';

import { AspectRatio } from 'react-aspect-ratio';

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
          <AspectRatio ratio={HEADER_ASPECT_RATIO} style={{ maxHeight: 175 }}>
            <SafeImage
              src={userProfileData?.headerPicture || DEFAULT_HEADER}
              style={{
                objectFit: 'cover',
                width: '100%',
              }}
              fill
              useNextImage
              alt="User header"
            />
          </AspectRatio>
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
