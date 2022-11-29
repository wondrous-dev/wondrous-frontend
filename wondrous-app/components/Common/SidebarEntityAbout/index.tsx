import { ButtonWrapper, Wrapper } from 'components/Common/SidebarEntityAbout/styles';
import InviteButton from 'components/Common/SidebarEntityInviteButton';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import SettingsButton from 'components/Common/SidebarEntitySettingsButton';
import useCanManage from 'hooks/useCanManage';
import { useRouter } from 'next/router';
import { useBoards } from 'utils/hooks';

const AboutEntity = () => {
  const router = useRouter();
  const { board } = useBoards();
  const canManage = useCanManage();
  const { id, name, thumbnailPicture, profilePicture } = board.orgData || board.pod || {};
  return (
    <Wrapper>
      <EntityMenu
        name={name}
        id={id}
        thumbnailPicture={thumbnailPicture}
        profilePicture={profilePicture}
        canManage={canManage}
      />
      <ButtonWrapper>
        {/* <SettingsButton router={router} board={board} id={id} canManage={canManage} />
        <InviteButton id={id} canManage={canManage} /> */}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default AboutEntity;
