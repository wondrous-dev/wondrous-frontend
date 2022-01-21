import { useEffect, useState } from 'react';
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
import PersonAddIcon from '../../Icons/personAdd';
import { CopyIcon, CopySuccessIcon } from '../../Icons/copy';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_POD_INVITE_LINK } from '../../../graphql/mutations/pod';
import { GET_POD_ROLES } from '../../../graphql/queries/pod';

const link = `https://www.wonder.io/invite/`;

export const PodInviteLinkModal = (props) => {
  const { podId, open, onClose } = props;
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${link}${data?.createPodInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getPodRoles, { data: podRoles }] = useLazyQuery(GET_POD_ROLES, {
    onCompleted: (data) => {
      if (data?.getPodRoles) {
        setRole(data?.getPodRoles[0]?.id);
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
    if (!role) {
      getPodRoles({
        variables: {
          podId: podId,
        },
      });
    }
    if (open) {
      createPodInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? 'one_time' : 'public',
            podId: podId,
            podRoleId: role,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createPodInviteLink, linkOneTimeUse, podId, podRoles, open, getPodRoles]);

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
              {podRoles?.getPodRoles &&
                podRoles?.getPodRoles.map((role) => (
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
};
