import { useCallback, useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { Typography } from '@mui/material';
import CheckMarkIcon from 'components/Icons/checkMark';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import { parseUserPermissionContext } from 'utils/helpers';
import { PERMISSIONS } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import useAlerts from 'hooks/useAlerts';
import palette from 'theme/palette';
import {
  MemberRole,
  MemberRoleSelect,
  MemberRoleSelectMenuIconWrapper,
  MemberRoleSelectMenuItem,
  MemberRoleSelectValueDisplay,
} from './styles';
import { filterRoles, getRoleColor, getRoleEmoji } from './helpers';

const MemberRoleSelectionDropdown = (props) => {
  const { existingRole, roleList, userId, podId } = props;
  const [roleId, setRoleId] = useState(existingRole?.id);

  const { showError } = useAlerts();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const showSuccessToast = (message: string) => {
    setSnackbarAlertSeverity('success');
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE, {
    onCompleted: () => {
      showSuccessToast('User role updated successfully');
    },
    onError: (error) => {
      showError('We faced some error while changing the user role. Please try again later.', true);
      Sentry.captureException(error);
    },
  });
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE, {
    onCompleted: () => {
      showSuccessToast('User role updated successfully');
    },
    onError: (error) => {
      showError('We faced some error while changing the user role. Please try again later.', true);
      Sentry.captureException(error);
    },
  });
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
      setRoleId(existingRole?.id);
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
    [orgId, roleId, userId]
  );

  const handleRoleChange = useCallback(
    (ev) => {
      const roleId = ev.target.value;

      setRoleId(roleId);

      if (podId) {
        handleUserRoleChangeInPod(roleId);
      } else {
        handleUserRoleChangeInOrg(roleId);
      }
    },
    [options]
  );

  const renderMemberRoleSelection = () => {
    const correspondingRole = options.find((r) => r.value === roleId);

    return (
      <MemberRoleSelectValueDisplay>
        <MemberRole borderColor={getRoleColor(correspondingRole)}>
          <span>{getRoleEmoji(correspondingRole)}</span>
          <Typography color={palette.white} textTransform="capitalize" fontSize={13} fontWeight={500}>
            {correspondingRole?.label}
          </Typography>
        </MemberRole>
      </MemberRoleSelectValueDisplay>
    );
  };

  return (
    <MemberRoleSelect renderValue={renderMemberRoleSelection} value={roleId} onChange={handleRoleChange}>
      {options.map((option) => (
        <MemberRoleSelectMenuItem key={option.label} value={option.value} isSelected={option.value === roleId}>
          <MemberRole borderColor={getRoleColor(option)}>
            <span>{getRoleEmoji(option)}</span>
            <Typography color={palette.white} textTransform="capitalize" fontSize={13} fontWeight={500}>
              {option.label}
            </Typography>
          </MemberRole>
          {option.value === roleId ? (
            <MemberRoleSelectMenuIconWrapper isSelected>
              <CheckMarkIcon fillColor={palette.highlightPurple} />
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
