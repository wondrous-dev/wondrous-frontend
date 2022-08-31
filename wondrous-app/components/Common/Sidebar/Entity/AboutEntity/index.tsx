import useCanManage from 'hooks/useCanManage';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useBoards } from 'utils/hooks';

import EntityMenu from './EntityMenu';
import InviteButton from './InviteButton';
import SettingsButton from './SettingsButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 24px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 4px;
`;

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
        <SettingsButton router={router} board={board} id={id} canManage={canManage} />
        <InviteButton id={id} canManage={canManage} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default AboutEntity;
