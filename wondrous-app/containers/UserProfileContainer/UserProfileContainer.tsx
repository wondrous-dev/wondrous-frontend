import { useRouter } from 'next/router';
import { withAuth } from 'components/Auth/withAuth';
import Image from 'next/image';

import useSideBar from 'hooks/useSideBar';
import { UserProfileContext } from 'utils/contexts';
import useGetUserProfile from 'hooks/useGetUserProfile';

import Header from 'components/Header';
import SideBar from 'components/SideBar';
import ProfileInfo from 'components/ProfileInfo';
import ProfileUserTaskDaos from 'components/ProfileUserTaskDaos';

import { UserProfileContainerWrapper, UserProfileHeaderImageWrapper, UserProfileContainerContent } from './styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { useLocation } from 'utils/useLocation';
import { delQuery } from 'utils/index';
import { enableContainerOverflow, disableContainerOverflow } from 'utils/helpers';
import { useEffect, useState } from 'react';

const UserProfileContainer = ({}) => {
  const router = useRouter();
  const { username, id: routerId } = router.query;
  const userProfileData = useGetUserProfile(routerId, username);

  const { minimized } = useSideBar();
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
    let newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    enableContainerOverflow();
    setOpenModal(false);
  };

  useEffect(() => {
    const params = location.params;
    if (params.task || params.taskProposal) {
      disableContainerOverflow();
      setOpenModal(true);
    }
  }, [location]);

  return (
    <UserProfileContext.Provider value={{}}>
      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={handleClose}
        taskId={taskId}
        isTaskProposal={!!location?.params?.taskProposal}
      />
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
    </UserProfileContext.Provider>
  );
};

export default withAuth(UserProfileContainer);
