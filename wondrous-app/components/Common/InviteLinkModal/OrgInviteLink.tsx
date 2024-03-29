import { useContext, useEffect, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_ORG_INVITE_LINK, SEND_ORG_EMAIL_INVITES } from 'graphql/mutations/org';
import { GET_ORG_ROLES } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard, useIsMobile } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, validateEmail } from 'utils/constants';
import CopyIcon from 'components/Icons/copy';
import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import RolePill from 'components/Common/RolePill';
import { InputAdornment } from '@mui/material';
import SearchIcon from 'components/Icons/search';
import { HeaderButton } from 'components/organization/wrapper/styles';

import DeleteBasketIcon from 'components/Icons/DeleteIcon';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import Modal from 'components/Modal';
import DropdownSelect from 'components/Common/DropdownSelect';
import { LinkType, putDefaultRoleOnTop } from 'components/Common/InviteLinkModal/utils';

import {
  CopyTypography,
  CopyContainer,
  InviteThruLinkTextField,
  LinkSwitch,
  LinkInviteContainer,
  StyledDivider,
  EmailInput,
  DisplaySearchedUser,
  DisplaySearchedUserContainer,
  UserBox,
  InvitedText,
  UsersDetailsBox,
  IndividualUserBox,
  NameContainer,
  DeleteBox,
} from './styles';

export function OrgInviteLinkComponent(props) {
  const {
    orgId,
    onClose,
    gradientStyles = {},
    hideDivider = false,
    postEmailInvite = null,
    postInviteLinkCreate = null,
  } = props;
  const isMobile = useIsMobile();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);
  const [copied, setCopied] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [linkType, setLinkType] = useState(LinkType.PUBLIC);
  const [inputText, setInputText] = useState(null);
  const [potentialInviteeList, setPotentialInviteeList] = useState([]);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const [inviteLink, setInviteLink] = useState('');

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const [sendOrgEmailInvites] = useMutation(SEND_ORG_EMAIL_INVITES, {
    onCompleted: (data) => {
      console.log(data);
      postEmailInvite?.();
    },
    onError: (e) => {
      console.error(e);
    },
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
      if (data?.getOrgRoles) {
        data?.getOrgRoles?.forEach((role) => {
          if (role?.default) {
            setActiveRoleId(role?.id);
          }
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const handleOnClose = () => {
    onClose?.();
    setCopied(false);
    setInviteLink('');
    setActiveRoleId(null);
    setInputText(null);
    setPotentialInviteeList([]);
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopied(true);
    postInviteLinkCreate?.();
  };

  useEffect(() => {
    if (!activeRoleId && orgId) {
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    }
  }, [activeRoleId, orgId, getOrgRoles]);

  useEffect(() => {
    createOrgInviteLink({
      variables: {
        input: {
          invitorId: '',
          type: linkType,
          orgId,
          orgRoleId: activeRoleId,
        },
      },
    });
    setCopied(false);
  }, [activeRoleId, linkType, orgId]);

  const roles = putDefaultRoleOnTop(orgRoles?.getOrgRoles, permissions);
  const activeRole = roles?.find((role) => role?.id === activeRoleId);
  useEffect(() => {
    if (!activeRoleId && roles?.length > 0) {
      roles.forEach((role) => {
        if (role?.default) {
          setActiveRoleId(role?.id);
        }
      });
    }
  }, [activeRoleId, roles]);
  const roleOptions = roles?.map((role) => {
    const emoji = getRoleEmoji(role?.name);
    const label = `${emoji} ${role?.name}`;
    return {
      label,
      value: role?.id,
    };
  });

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddEmailToList = (email) => {
    const itemIndex = potentialInviteeList.findIndex((invitee) => email === invitee.email);
    if (itemIndex === -1) {
      setPotentialInviteeList((prev) => [...prev, { email, role: activeRole }]);
    }

    setInputText('');
  };

  const handleRemoveFromEmailList = (inviteeToRemove) => {
    const newList = potentialInviteeList.filter((invitee) => inviteeToRemove.email !== invitee?.email);
    setPotentialInviteeList(newList);
  };

  const handleSendInvite = () => {
    const emailAndRoleId = potentialInviteeList.map((invitee) => ({
      email: invitee.email,
      roleId: invitee.role.id,
    }));
    sendOrgEmailInvites({
      variables: {
        input: {
          orgId,
          emailsAndRoles: emailAndRoleId,
        },
      },
    }).then((res) => {
      setSnackbarAlertMessage('Invites sent successfully');
      setSnackbarAlertOpen(true);
      handleOnClose();
    });
  };
  return (
    <>
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%" {...gradientStyles}>
        Invite from link
      </GradientHeading>
      <LinkInviteContainer>
        <DropdownSelect
          value={activeRoleId}
          options={roleOptions}
          setValue={setActiveRoleId}
          formSelectStyle={{
            height: 'auto',
            width: '40%',
          }}
          innerStyle={{
            marginTop: '0px',
            height: '40px',
            padding: '0px 0px',
          }}
        />
        <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
        {!isMobile ? (
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
            <CopyIcon color={copied ? palette.green30 : palette.blue20} />
            <CopyTypography $copied={copied}>{copied ? 'Link copied' : 'Copy link'}</CopyTypography>
          </CopyContainer>
        ) : (
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
            <CopyIcon color={copied ? palette.green30 : palette.blue20} />
          </CopyContainer>
        )}
      </LinkInviteContainer>
      <LinkSwitch
        label="Link expires after one-time use"
        checked={linkType === LinkType.ONE_TIME}
        onClick={() => setLinkType(linkType === LinkType.ONE_TIME ? LinkType.PUBLIC : LinkType.ONE_TIME)}
      />
      {hideDivider ? null : <StyledDivider />}
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%" {...gradientStyles}>
        Invite through email
      </GradientHeading>
      <LinkInviteContainer>
        <DropdownSelect
          value={activeRoleId}
          options={roleOptions}
          setValue={setActiveRoleId}
          formSelectStyle={{
            height: 'auto',
            width: '40%',
          }}
          innerStyle={{
            marginTop: '0px',
            height: '40px',
            padding: '0px 0px',
          }}
        />
        <div
          style={{
            width: '80%',
          }}
        >
          <EmailInput
            placeholder="Enter email..."
            value={inputText}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: false }}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                if (validateEmail(inputText)) {
                  handleAddEmailToList(inputText);
                }
              }
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="start" style={{ paddingRight: 0 }}>
                  <SearchIcon color="white" height={11} />
                </InputAdornment>
              ),
            }}
          />

          {inputText && (
            <div>
              {validateEmail(inputText) ? (
                <DisplaySearchedUserContainer>
                  <DisplaySearchedUser
                    type="email"
                    onClick={() => {
                      handleAddEmailToList(inputText);
                    }}
                  >
                    <p>{inputText}</p>
                  </DisplaySearchedUser>
                </DisplaySearchedUserContainer>
              ) : (
                <DisplaySearchedUserContainer>
                  <DisplaySearchedUser type="email">
                    <p>Enter a valid email</p>
                  </DisplaySearchedUser>
                </DisplaySearchedUserContainer>
              )}
            </div>
          )}
        </div>
      </LinkInviteContainer>
      <UserBox>
        <InvitedText>Invite {potentialInviteeList.length} user(s)</InvitedText>
        <UsersDetailsBox>
          {potentialInviteeList.map((invitee, i) => (
            <IndividualUserBox key={i}>
              <NameContainer>
                <p>{invitee.email}</p>
              </NameContainer>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <RolePill fontSize={12} roleName={invitee?.role?.name} />
                <DeleteBox onClick={() => handleRemoveFromEmailList(invitee)}>
                  <DeleteBasketIcon />
                </DeleteBox>
              </div>
            </IndividualUserBox>
          ))}{' '}
        </UsersDetailsBox>
      </UserBox>
      {potentialInviteeList?.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <HeaderButton reversed onClick={handleSendInvite}>
            Send Invite
          </HeaderButton>
        </div>
      )}
    </>
  );
}

const OrgInviteLinkModal = (props) => {
  const { orgId, open, onClose } = props;

  return open ? (
    <Modal title="Add Members" open={open} onClose={onClose} maxWidth={660}>
      <OrgInviteLinkComponent {...props} />
    </Modal>
  ) : null;
};

export default OrgInviteLinkModal;
