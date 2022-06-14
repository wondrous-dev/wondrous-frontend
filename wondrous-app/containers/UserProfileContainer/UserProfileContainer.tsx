import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Image from 'next/image';

import Box from '@mui/material/Box';

import { SIDEBAR_WIDTH } from 'utils/constants';
import useGetUserProfile from 'hooks/useGetUserProfile';
import useSideBar from 'hooks/useSideBar';

import Header from 'components/Header';
import SideBar from 'components/SideBar';
import ProfileInfo from 'components/ProfileInfo';
import ProfileUserTaskDaos from 'components/ProfileUserTaskDaos';

import { UserProfileContainerWrapper, UserProfileHeaderImageWrapper, UserProfileContainerContent } from './styles';

const UserProfileContainer = ({}) => {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfileData = useGetUserProfile(routerId, username);

  const { minimized } = useSideBar();

  return (
    <>
      <Header />
      <SideBar />
      <UserProfileContainerWrapper minimized={minimized}>
        <UserProfileHeaderImageWrapper>
          <Image src="/images/profile/profileBackground.png" layout="fill" objectFit="cover" alt="header-image" />
        </UserProfileHeaderImageWrapper>
        <UserProfileContainerContent>
          <ProfileInfo userProfile={userProfileData} />
          <ProfileUserTaskDaos userProfile={userProfileData} />
        </UserProfileContainerContent>
      </UserProfileContainerWrapper>
    </>
  );
};

export default withAuth(UserProfileContainer);
