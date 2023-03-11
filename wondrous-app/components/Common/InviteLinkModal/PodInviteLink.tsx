import { useContext, useEffect, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { useLazyQuery, useMutation } from '@apollo/client';
import { BATCH_ADD_USERS_TO_POD, CREATE_POD_INVITE_LINK, SEND_POD_EMAIL_INVITES } from 'graphql/mutations/pod';
import { GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard, useIsMobile } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, validateEmail } from 'utils/constants';
import CopyIcon from 'components/Icons/copy';
import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import RolePill from 'components/Common/RolePill';
import { InputAdornment } from '@mui/material';
import SearchIcon from 'components/Icons/search';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
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

function PodInviteLinkModal(props) {
  const { podId, open, onClose } = props;
  const isMobile = useIsMobile();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);
  const [copied, setCopied] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [linkType, setLinkType] = useState('public');
  const [inputText, setInputText] = useState(null);
  const [podUsers, setPodUsers] = useState([]);
  const [potentialInviteeList, setPotentialInviteeList] = useState([]);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const [inviteLink, setInviteLink] = useState('');
  const orgId = podBoard?.orgId;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const [sendPodEmailInvites] = useMutation(SEND_POD_EMAIL_INVITES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [batchAddUsers] = useMutation(BATCH_ADD_USERS_TO_POD, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createPodInviteLink.token}`);
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
            setActiveRoleId(role?.id);
          }
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const searchedUserList = searchOrgUserResults?.searchOrgUsers;

  const [getPodUsers, { fetchMore: fetchMorePodUsers }] = useLazyQuery(GET_POD_USERS, {
    fetchPolicy: 'network-only',
  });

  const handleOnClose = () => {
    onClose();
    setCopied(false);
    setInviteLink('');
    setActiveRoleId(null);
    setInputText(null);
    setPotentialInviteeList([]);
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopied(true);
  };

  useEffect(() => {
    if (!activeRoleId && podId && open) {
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [activeRoleId, podId, open, getPodRoles]);
  useEffect(() => {
    getPodUsers({
      variables: {
        podId,
        limit: 1000,
      },
    }).then((result) => {
      setPodUsers(result?.data?.getPodUsers);
    });
  }, [podId]);
  useEffect(() => {
    if (open) {
      createPodInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkType,
            podId,
            podRoleId: activeRoleId,
          },
        },
      });
    }
    setCopied(false);
  }, [activeRoleId, linkType, podId, open]);
  const roles = putDefaultRoleOnTop(podRoles?.getPodRoles, permissions);
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
  const podUserIds = podUsers?.map((user) => user?.user?.id);

  const filterOrgUsersForAutocomplete = (users) => {
    if (!users) {
      return [];
    }
    return users
      .filter((user) => {
        if (podUserIds.includes(user?.id)) {
          return false;
        }
        return true;
      })
      .map((user) => ({
        ...user,
        profilePicture: user?.thumbnailPicture || user?.profilePicture,
        label: user?.username,
        value: user?.id,
      }));
  };
  const filteredInviteeList = filterOrgUsersForAutocomplete(potentialInviteeList);
  const search = useCallback(debounce(searchOrgUsers, 200), []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (e.target.value) {
      search({ variables: { searchString: e.target.value, orgIds: orgId } });
    }
  };

  const handleAddUserToList = (userOrEmail, type) => {
    const itemIndex = potentialInviteeList.findIndex((user) => {
      if (type === 'user') {
        return userOrEmail.username === user?.user?.username;
      }
      return userOrEmail === user.email;
    });
    if (itemIndex === -1) {
      setPotentialInviteeList((prev) => [...prev, { user: userOrEmail, email: userOrEmail, role: activeRole, type }]);
    }

    setInputText('');
  };

  const handleRemoveFromUsersList = (inviteeToRemove) => {
    const newList = potentialInviteeList.filter(
      (invitee) =>
        inviteeToRemove?.user?.username !== invitee?.user?.username || inviteeToRemove.email !== invitee?.email
    );
    setPotentialInviteeList(newList);
  };
  const handleSendInvite = async () => {
    const users = potentialInviteeList.filter((invitee) => invitee?.type === 'user');
    const emails = potentialInviteeList.filter((invitee) => invitee?.type === 'email');
    const emailAndRoleId = emails.map((invitee) => ({
      email: invitee.email,
      roleId: invitee?.role?.id,
    }));
    const userIdandRoleId = users.map((invitee) => ({
      userId: invitee?.user?.id,
      roleId: invitee?.role?.id,
    }));
    let addUserPromise;
    let sendEmailPromise;
    if (userIdandRoleId?.length > 0) {
      addUserPromise = batchAddUsers({
        variables: {
          input: {
            podId,
            usersRoles: userIdandRoleId,
          },
        },
      });
    }
    if (emailAndRoleId?.length > 0) {
      sendEmailPromise = sendPodEmailInvites({
        variables: {
          input: {
            podId,
            emailsAndRoles: emailAndRoleId,
          },
        },
      });
    }
    await Promise.all([sendEmailPromise, addUserPromise]);

    handleOnClose();
  };

  return (
    <Modal title="Add Members" open={open} onClose={handleOnClose} maxWidth={660}>
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
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
      <StyledDivider />
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
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
            placeholder="Enter email or username..."
            value={inputText}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: false }}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                if (validateEmail(inputText)) {
                  handleAddUserToList(inputText, 'email');
                } else if (searchedUserList?.length) {
                  handleAddUserToList(searchedUserList[0], 'user');
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
                      handleAddUserToList(inputText, 'email');
                    }}
                  >
                    <p>{inputText}</p>
                  </DisplaySearchedUser>
                </DisplaySearchedUserContainer>
              ) : (
                <DisplaySearchedUserContainer>
                  {searchedUserList?.length ? (
                    searchedUserList.map((user, i) => (
                      <DisplaySearchedUser
                        key={i}
                        onClick={() => {
                          handleAddUserToList(user, 'user');
                        }}
                      >
                        <UserProfilePicture avatar={user?.thumbnailPicture || user?.profilePicture} />
                        <p>{user.username}</p>
                      </DisplaySearchedUser>
                    ))
                  ) : (
                    <DisplaySearchedUser style={{ color: 'white' }}>User not found...</DisplaySearchedUser>
                  )}
                </DisplaySearchedUserContainer>
              )}
            </div>
          )}
        </div>
      </LinkInviteContainer>
      <UserBox>
        <InvitedText>Invite {filteredInviteeList.length} user(s)</InvitedText>
        <UsersDetailsBox>
          {filteredInviteeList.map((invitee, i) => (
            <IndividualUserBox key={i}>
              <NameContainer>
                {invitee.type === 'user' && (
                  <UserProfilePicture
                    style={{ marginRight: 0 }}
                    avatar={invitee?.user?.thumbnailPicture || invitee?.user?.profilePicture}
                  />
                )}
                <p>{invitee.type === 'email' ? invitee.email : invitee?.user?.username}</p>
              </NameContainer>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <RolePill fontSize={12} roleName={invitee?.role?.name} />
                <DeleteBox onClick={() => handleRemoveFromUsersList(invitee)}>
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
    </Modal>
  );
}
export default PodInviteLinkModal;
