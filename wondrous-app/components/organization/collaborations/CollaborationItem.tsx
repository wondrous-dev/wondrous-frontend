import { SharedOrgHeaderCard } from 'components/Collaboration/SharedOrgHeader';
import RolePill from 'components/Common/RolePill';
import SmartLink from 'components/Common/SmartLink';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { RoleButtonWrapper } from '../wrapper/styles';
import { CollabBottom, CollabCard, CollabCardHeader, CollabDescription } from './styles';

const ORG_PERMISSIONS = {
  MANAGE_SETTINGS: 'manageSettings',
  CONTRIBUTOR: 'contributor',
};

const ActiveCollaborationItem = (props) => {
  const { collab, userPermissionsContext } = props;
  const [orgRoleName, setOrgRoleName] = useState(null);
  const [permissions, setPermissions] = useState(undefined);
  useEffect(() => {
    const orgPermissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: collab?.id,
    });
    const role = userPermissionsContext?.orgRoles[collab?.id];
    setOrgRoleName(role);
    if (
      orgPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      orgPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      orgPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (
      userPermissionsContext?.orgPermissions &&
      collab?.id in userPermissionsContext?.orgPermissions &&
      orgPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collab?.id, userPermissionsContext]);
  return (
    <SmartLink href={`/collaboration/${collab?.username}/boards`}>
      <CollabCard>
        <CollabCardHeader>
          <SharedOrgHeaderCard collab={collab} />
        </CollabCardHeader>
        <CollabDescription>{collab?.description}</CollabDescription>
        <CollabBottom>
          <RoleButtonWrapper
            style={{
              marginRight: '8px',
            }}
          >
            <RolePill roleName={orgRoleName}>🔑 {orgRoleName}</RolePill>
          </RoleButtonWrapper>
          <TaskCardPrivacy privacyLevel={collab?.privacyLevel} />
        </CollabBottom>
      </CollabCard>
    </SmartLink>
  );
};

export default ActiveCollaborationItem;
