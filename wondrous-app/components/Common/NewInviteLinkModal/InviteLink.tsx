import { useEffect, useState } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import Modal from '@mui/material/Modal';

import { useMe } from 'components/Auth/withAuth';
import PersonAddIcon from 'components/Icons/personAdd';
import { CopyIcon, CopySuccessIcon } from 'components/Icons/copy';
import { putDefaultRoleOnTop } from 'components/Common/InviteLinkModal/OrgInviteLink';

import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, ONE_TIME_USE_INVITE_LINK, PUBLIC_INVITE_LINK, ORG_TYPES } from 'utils/constants';

import { CREATE_POD_INVITE_LINK } from 'graphql/mutations/pod';
import { GET_POD_ROLES } from 'graphql/queries';
import { CREATE_ORG_INVITE_LINK } from 'graphql/mutations/org';
import { GET_ORG_ROLES } from 'graphql/queries/org';
import {
  StyledBox,
  TextHeading,
  CloseButton,
  PersonAddIconWrapper,
  TextHeadingWrapper,
  HeadingWrapper,
  IconTextWrapper,
  InviteButton,
  InviteThruLinkLabel,
  InviteThruLinkTextField,
  InviteThruLinkButtonLabel,
  InviteThruLinkInputWrapper,
  StyledDivider,
  InviteThruLinkSelect,
  InviteThruLinkMenuItem,
  InviteThruLinkFormControlSelect,
  InviteThruLinkButtonSuccessLabel,
  LinkSwitch,
  TextSubheading,
} from './styles';

const ORG_TYPES_PATHS = {
  [ORG_TYPES.ORG]: 'invite',
  [ORG_TYPES.COLLAB]: 'invite/collab/members',
};
export function NewInviteLinkModal(props) {
  const { orgOrPodName, orgId, podId, open, onClose, orgType = ORG_TYPES.ORG } = props;
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
  const user = useMe();

  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/${ORG_TYPES_PATHS[orgType]}/${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
    },
  });

  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/pod/${data?.createPodInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
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
      Sentry.captureException(e);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getPodRoles, { data: podRoles }] = useLazyQuery(GET_POD_ROLES, {
    onCompleted: (data) => {
      data?.getPodRoles &&
        data?.getPodRoles?.forEach((role) => {
          if (role?.default) {
            setRole(role?.id);
          }
        });
    },
    onError: (e) => {
      console.error(e);
      Sentry.captureException(e);
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

  const isOrg = !!orgId;

  useEffect(() => {
    if (!role && open) {
      if (isOrg) {
        getOrgRoles({
          variables: {
            orgId,
          },
        });
      } else {
        getPodRoles({
          variables: {
            podId,
          },
        });
      }
    }
    if (open) {
      if (isOrg) {
        createOrgInviteLink({
          variables: {
            input: {
              invitorId: user?.id,
              type: linkOneTimeUse ? ONE_TIME_USE_INVITE_LINK : PUBLIC_INVITE_LINK,
              orgId,
              orgRoleId: role,
            },
          },
        });
      } else {
        createPodInviteLink({
          variables: {
            input: {
              invitorId: user?.id,
              type: linkOneTimeUse ? ONE_TIME_USE_INVITE_LINK : PUBLIC_INVITE_LINK,
              podId,
              podRoleId: role,
            },
          },
        });
      }
    }
    setCopy(false);
  }, [role, linkOneTimeUse, orgId, podId, open]);

  const roles = isOrg
    ? putDefaultRoleOnTop(orgRoles?.getOrgRoles, permissions)
    : putDefaultRoleOnTop(podRoles?.getPodRoles, permissions);

  return (
    <Modal open={open} onClose={handleOnClose}>
      <StyledBox>
        <HeadingWrapper>
          <IconTextWrapper>
            <PersonAddIconWrapper>
              <PersonAddIcon />
            </PersonAddIconWrapper>
            <TextHeadingWrapper>
              <TextHeading>Invite new members to</TextHeading>
              <TextSubheading>{orgOrPodName}</TextSubheading>
            </TextHeadingWrapper>
          </IconTextWrapper>
          <CloseButton circle onClick={handleOnClose} />
        </HeadingWrapper>
        <InviteThruLinkLabel>Invite through universal link</InviteThruLinkLabel>
        <InviteThruLinkInputWrapper>
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
          <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
          <InviteButton rightPadding onClick={handleOnCopy}>
            {copy ? (
              <>
                <InviteThruLinkButtonSuccessLabel>Link copied!</InviteThruLinkButtonSuccessLabel> <CopySuccessIcon />
              </>
            ) : (
              <>
                <InviteThruLinkButtonLabel>Copy link</InviteThruLinkButtonLabel> <CopyIcon color="#7427FF" />
              </>
            )}
          </InviteButton>
        </InviteThruLinkInputWrapper>

        <StyledDivider />
        {/* <InviteThruEmailLabel>Invite through email</InviteThruEmailLabel>
        <InviteThruEmailTextFieldButtonWrapper>
          <InviteThruEmailTextFieldSelectWrapper>
            <InviteThruEmailTextField placeholder="Enter email address" />
          </InviteThruEmailTextFieldSelectWrapper>
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
          <InviteButton justifyCenter={true}>
            <InviteThruEmailButtonLabel>Send invite</InviteThruEmailButtonLabel>
          </InviteButton>
        </InviteThruEmailTextFieldButtonWrapper>
        <StyledDivider /> */}
        <LinkSwitch label="One time use" checked={linkOneTimeUse} onClick={handleLinkOneTimeUseChange} />
      </StyledBox>
    </Modal>
  );
}
