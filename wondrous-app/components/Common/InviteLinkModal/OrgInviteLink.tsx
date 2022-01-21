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
import { CREATE_ORG_INVITE_LINK } from '../../../graphql/mutations/org';
import { GET_ORG_ROLES } from '../../../graphql/queries/org';

const link = `https://www.wonder.io/invite/`;

export const OrgInviteLinkModal = (props) => {
  const { orgId, open, onClose } = props;
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${link}${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES, {
    onCompleted: (data) => {
      setRole(data?.getOrgRoles[0]?.id);
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
      getOrgRoles({
        variables: {
          orgId: orgId,
        },
      });
    }
    if (open) {
      createOrgInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkOneTimeUse ? 'one_time' : 'public',
            orgId: orgId,
            orgRoleId: role,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createOrgInviteLink, linkOneTimeUse, orgId, orgRoles, open, getOrgRoles]);

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
              {orgRoles?.getOrgRoles &&
                orgRoles?.getOrgRoles.map((role) => (
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
