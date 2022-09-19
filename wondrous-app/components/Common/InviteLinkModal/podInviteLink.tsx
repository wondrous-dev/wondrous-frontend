import { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_POD_INVITE_LINK } from 'graphql/mutations/pod';
import { GET_POD_ROLES } from 'graphql/queries/pod';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK } from 'utils/constants';
import { putDefaultRoleOnTop } from './OrgInviteLink';
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

export function PodInviteLinkModal(props) {
  const { podId, open, onClose } = props;
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
  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createPodInviteLink.token}?type=pod`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getPodRoles, { data: podRoles }] = useLazyQuery(GET_POD_ROLES, {
    onCompleted: (data) => {
      if (data?.getPodRoles) {
        data?.getPodRoles?.forEach((role) => {
          if (role?.default) {
            setRole(role?.id);
          }
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
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
    if (!role && podId) {
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
    if (open) {
      createPodInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? 'one_time' : 'public',
            podId,
            podRoleId: role,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createPodInviteLink, linkOneTimeUse, podId, podRoles, open, getPodRoles]);
  const roles = putDefaultRoleOnTop(podRoles?.getPodRoles, permissions);

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
