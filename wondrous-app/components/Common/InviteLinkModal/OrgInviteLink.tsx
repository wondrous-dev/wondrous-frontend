import { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_ORG_INVITE_LINK } from 'graphql/mutations/org';
import { GET_ORG_ROLES } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, PERMISSIONS } from 'utils/constants';
import { CopyIcon, CopySuccessIcon } from '../../Icons/copy';
import PersonAddIcon from '../../Icons/personAdd';
import {
  StyledModal,
  StyledBox,
  TextHeading,
  TextSubheading,
  CloseButton,
  PersonAddIconWrapper,
  TextHeadingWrapper,
  HeadingWrapper,
  IconTextWrapper,
  InviteThruLinkLabel,
  InviteThruLinkTextField,
  InviteThruLinkButton,
  InviteThruLinkButtonLabel,
  InviteThruLinkInputWrapper,
  StyledDivider,
  InviteThruEmailLabel,
  InviteThruEmailTextFieldButtonWrapper,
  InviteThruEmailTextField,
  InviteThruLinkSelect,
  InviteThruLinkMenuItem,
  InviteThruLinkFormControlSelect,
  InviteThruEmailTextFieldSelectWrapper,
  InviteThruEmailButtonLabel,
  InviteThruEmailButton,
  InviteThruLinkButtonSuccessLabel,
  LinkSwitch,
} from './styles';

export const putDefaultRoleOnTop = (roles, permissions) => {
  if (!roles) return [];
  roles = [...roles];
  let defaultRole;
  let defaultRoleIndex;
  roles.forEach((role, index) => {
    if (role?.default) {
      defaultRole = { ...role };
      defaultRoleIndex = index;
    }
  });
  roles.filter((role) => {
    if (role?.permissions?.includes(PERMISSIONS.FULL_ACCESS) && !permissions.includes(PERMISSIONS.FULL_ACCESS)) {
      return false;
    }
    return true;
  });

  if (defaultRole && defaultRoleIndex) {
    roles?.splice(defaultRoleIndex, 1);
    roles?.unshift(defaultRole);
  }
  return roles;
};

export function OrgInviteLinkModal(props) {
  const { orgId, open, onClose } = props;
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES, {
    onCompleted: (data) => {
      data?.getOrgRoles &&
        data?.getOrgRoles?.forEach((role) => {
          if (role?.default) {
            setRole(role?.id);
          }
        });
    },
    onError: (e) => {
      console.error(e);
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleOnClose = () => {
    onClose();
    setCopy(false);
    setLinkOneTimeUse(false);
    setInviteLink('');
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopy(true);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLinkOneTimeUseChange = () => {
    setLinkOneTimeUse(!linkOneTimeUse);
  };

  useEffect(() => {
    if (!role && open) {
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    }
    if (open) {
      createOrgInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? 'one_time' : 'public',
            orgId,
            orgRoleId: role,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createOrgInviteLink, linkOneTimeUse, orgId, orgRoles, open, getOrgRoles]);
  const roles = putDefaultRoleOnTop(orgRoles?.getOrgRoles, permissions);

  return (
    <StyledModal open={open} onClose={handleOnClose}>
      <StyledBox>
        <HeadingWrapper>
          <IconTextWrapper>
            <PersonAddIconWrapper>
              <PersonAddIcon />
            </PersonAddIconWrapper>
            <TextHeadingWrapper>
              <TextHeading>Share with people and groups</TextHeading>
            </TextHeadingWrapper>
          </IconTextWrapper>
          <CloseButton onClick={handleOnClose} />
        </HeadingWrapper>
        <InviteThruLinkLabel>Invite through universal link</InviteThruLinkLabel>
        <InviteThruLinkInputWrapper>
          <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
          <InviteThruLinkFormControlSelect>
            <InviteThruLinkSelect value={role} onChange={handleRoleChange}>
              {roles &&
                roles.map((role) => (
                  <InviteThruLinkMenuItem key={role.id} value={role.id}>
                    {role.name}
                  </InviteThruLinkMenuItem>
                ))}
            </InviteThruLinkSelect>
          </InviteThruLinkFormControlSelect>
          <InviteThruLinkButton onClick={handleOnCopy}>
            {copy ? (
              <>
                <InviteThruLinkButtonSuccessLabel>Link copied!</InviteThruLinkButtonSuccessLabel> <CopySuccessIcon />
              </>
            ) : (
              <>
                <InviteThruLinkButtonLabel>Copy link</InviteThruLinkButtonLabel> <CopyIcon />
              </>
            )}
          </InviteThruLinkButton>
        </InviteThruLinkInputWrapper>
        <LinkSwitch
          label="Link expires after one-time use"
          checked={linkOneTimeUse}
          onClick={handleLinkOneTimeUseChange}
        />
        {/* <StyledDivider /> */}
        {/* <InviteThruEmailLabel>
                    Invite through email
                </InviteThruEmailLabel> */}
        {/* <InviteThruEmailTextFieldButtonWrapper>
                    <InviteThruEmailTextFieldSelectWrapper>
                        <InviteThruEmailTextField />
                        <InviteThruEmailFormControlSelect>
                            <InviteThruEmailSelect value={selectRole} onChange={(e) => setSelectRole(e.target.value)}>
                                <InviteThruEmailMenuItem value="contributor">contributor</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="admin">admin</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="core team">core team</InviteThruEmailMenuItem>
                            </InviteThruEmailSelect>
                        </InviteThruEmailFormControlSelect>
                    </InviteThruEmailTextFieldSelectWrapper>
                    <InviteThruEmailButton>
                        <InviteThruEmailButtonLabel>Send invite</InviteThruEmailButtonLabel>
                    </InviteThruEmailButton>
                </InviteThruEmailTextFieldButtonWrapper> */}
      </StyledBox>
    </StyledModal>
  );
}

export default OrgInviteLinkModal;
