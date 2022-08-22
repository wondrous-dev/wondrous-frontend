import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useBoards } from 'utils/hooks';

import EntityMenu from './EntityMenu';
import InviteButton from './InviteButton';
import PrivacyIcon from './PrivacyIcon';
import SettingsButton from './SettingsButton';
import TokenGatingIcon from './TokenGatingIcon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AboutEntity = () => {
  const router = useRouter();
  const { board } = useBoards();
  if (!(board?.orgData || board?.pod)) return null;
  const { privacyLevel, id, name, thumbnailPicture, profilePicture } = board.orgData || board.pod;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const canManage =
    permissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.APPROVE_PAYMENT);
  return (
    <Wrapper>
      <EntityMenu
        name={name}
        id={id}
        router={router}
        thumbnailPicture={thumbnailPicture}
        profilePicture={profilePicture}
        canManage={canManage}
      />
      <ButtonWrapper>
        <SettingsButton router={router} board={board} id={id} canManage={canManage} />
        <PrivacyIcon privacyLevel={privacyLevel} />
        <TokenGatingIcon orgId={board?.orgId} />
        <InviteButton id={id} canManage={canManage} />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default AboutEntity;
