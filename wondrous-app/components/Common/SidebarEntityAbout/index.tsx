import { useMe } from 'components/Auth/withAuth';
import { ButtonWrapper, Wrapper } from 'components/Common/SidebarEntityAbout/styles';
import InviteButton from 'components/Common/SidebarEntityInviteButton';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import SettingsButton from 'components/Common/SidebarEntitySettingsButton';
import useCanManage from 'hooks/useCanManage';
import { useRouter } from 'next/router';
import { useBoards } from 'utils/hooks';

const AboutEntity = () => {
  const user = useMe();
  return (
    <Wrapper>
      <EntityMenu user={user} />
      <ButtonWrapper></ButtonWrapper>
    </Wrapper>
  );
};

export default AboutEntity;
