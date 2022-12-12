<<<<<<< HEAD
import { useMe } from 'components/Auth/withAuth';
import { ButtonWrapper, Wrapper } from 'components/Common/SidebarEntityAbout/styles';
import InviteButton from 'components/Common/SidebarEntityInviteButton';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import SettingsButton from 'components/Common/SidebarEntitySettingsButton';
import useCanManage from 'hooks/useCanManage';
import { useRouter } from 'next/router';
=======
>>>>>>> staging
import { useBoards } from 'utils/hooks';

import SidebarEntityAboutMemo from './SidebarEntityAboutMemoized';

const AboutEntity = () => {
<<<<<<< HEAD
  const user = useMe();
  return (
    <Wrapper>
      <EntityMenu user={user} />
      <ButtonWrapper></ButtonWrapper>
    </Wrapper>
=======
  const { board } = useBoards();
  const { id, name, thumbnailPicture, profilePicture } = board.orgData || board.pod || {};

  return (
    <SidebarEntityAboutMemo
      id={id}
      board={board}
      name={name}
      thumbnailPicture={thumbnailPicture}
      profilePicture={profilePicture}
    />
>>>>>>> staging
  );
};

export default AboutEntity;
