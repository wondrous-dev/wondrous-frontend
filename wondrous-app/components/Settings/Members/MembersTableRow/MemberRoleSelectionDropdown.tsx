import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import CheckMarkIcon from 'components/Icons/checkMark';
import { UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import { parseUserPermissionContext } from 'utils/helpers';
import { PERMISSIONS } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import {
  MemberRole,
  MemberRoleEmoji,
  MemberRoleLabel,
  MemberRoleSelect,
  MemberRoleSelectMenuIconWrapper,
  MemberRoleSelectMenuItem,
  MemberRoleSelectValueDisplay,
} from './styles';
import { filterRoles, getRoleColor, getRoleEmoji } from './helpers';

const MemberRoleSelectionDropdown = (props) => {
  const { existingRole, roleList, userId, podId } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE);
  const isOwner = existingRole?.permissions.includes(PERMISSIONS.FULL_ACCESS);
  const settings = useSettings();
  const orgId = props?.orgId || settings?.pod?.orgId;
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
    podId,
  });
  const userIsOwner = permissions.includes(PERMISSIONS.FULL_ACCESS);

  useEffect(() => {
    if (existingRole?.id) {
      setRole(existingRole?.id);
    }
  }, [existingRole?.id]);

  const options: { label: string; value: number }[] = filterRoles(roleList, isOwner, userIsOwner);

  const handleUserRoleChangeInPod = useCallback(
    (roleId) => {
      updateUserPodRole({
        variables: {
          input: {
            userId,
            podId,
            roleId,
          },
        },
      });
    },
    [podId, userId]
  );
  const handleUserRoleChangeInOrg = useCallback(
    (roleId) => {
      updateUserOrgRole({
        variables: {
          input: {
            userId,
            orgId,
            roleId,
          },
        },
      });
    },
    [orgId, role, userId]
  );

  const handleRoleChange = useCallback(
    (ev) => {
      const roleValue = ev.target.value;

      setRole(roleValue);

      if (podId) {
        handleUserRoleChangeInPod(roleValue);
      } else {
        handleUserRoleChangeInOrg(roleValue);
      }
    },
    [options]
  );

  const renderMemberRoleSelection = () => {
    const correspondingRole = options.find((r) => r.value === role);

    return (
      <MemberRoleSelectValueDisplay>
        <MemberRole borderColor={getRoleColor(correspondingRole)}>
          <MemberRoleEmoji>{getRoleEmoji(correspondingRole)}</MemberRoleEmoji>
          <MemberRoleLabel>{correspondingRole?.label}</MemberRoleLabel>
        </MemberRole>
      </MemberRoleSelectValueDisplay>
    );
  };

  return (
    <MemberRoleSelect renderValue={renderMemberRoleSelection} value={role} onChange={handleRoleChange}>
      {options.map((option) => (
        <MemberRoleSelectMenuItem key={option.label} value={option.value} isSelected={option.value === role}>
          <MemberRole borderColor={getRoleColor(option)}>
            <MemberRoleEmoji>{getRoleEmoji(option)}</MemberRoleEmoji>
            <MemberRoleLabel>{option.label}</MemberRoleLabel>
          </MemberRole>
          {option.value === role ? (
            <MemberRoleSelectMenuIconWrapper isSelected>
              <CheckMarkIcon fillColor="#7427FF" />
            </MemberRoleSelectMenuIconWrapper>
          ) : (
            <MemberRoleSelectMenuIconWrapper />
          )}
        </MemberRoleSelectMenuItem>
      ))}
    </MemberRoleSelect>
  );
};

export default MemberRoleSelectionDropdown;
