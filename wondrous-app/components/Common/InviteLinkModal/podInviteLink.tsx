import { useContext, useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { BATCH_ADD_USERS_TO_POD, CREATE_POD_INVITE_LINK, SEND_POD_EMAIL_INVITES } from 'graphql/mutations/pod';
import { GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { GET_ORG_USERS } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, validateEmail } from 'utils/constants';
import Checkbox from '@mui/material/Checkbox';
import ArrowFillIcon from 'components/Icons/arrowfill';
import DeleteBasketIcon from 'components/Icons/DeleteBasketIcon';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import { Button } from 'components/Button';
import palette from 'theme/palette';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import SearchIcon from 'components/Icons/search';
import { putDefaultRoleOnTop } from './OrgInviteLink';
import {
  BottomBox,
  CancelButton,
  CloseButton,
  CopyLinkBox,
  DashedLine,
  DefaultProfilePicture,
  DeleteBox,
  DisplaySearchedUser,
  DisplaySearchedUserContainer,
  EmptySearch,
  HeadingWrapper,
  IconTextWrapper,
  IndividualRoleBox,
  IndividualUserBox,
  InvitedText,
  LinkFlex,
  LinkIconBox,
  LinkSwitch,
  NameContainer,
  RoleContainer,
  RoleDeleteContainer,
  RoleText,
  SearchUserBox,
  SearchUserContainer,
  SelectRoleBox,
  SelectRoleContainer,
  SelectUserContainer,
  StyledBox,
  StyledModal,
  TextHeading,
  TextHeadingWrapper,
  TopDivider,
  UniversalBox,
  UniversalLinkButton,
  UserBox,
  UserProfilePicture,
  UsersDetailsBox,
} from './styles';

export function PodInviteLinkModal(props) {
  const roleContainerRef = useRef<HTMLDivElement>(null);
  const { podId, open, onClose } = props;
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const [copy, setCopy] = useState(false);
  const [role, setRole] = useState('');
  const [linkOneTimeUse, setLinkOneTimeUse] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const [userList, setUserList] = useState([]);
  const [eligibleUserList, setEligibleUserList] = useState([]);
  const [orgUserList, setOrgUserList] = useState([]);
  const [activeRole, setActiveRole] = useState<any>({});
  const [inviteLink, setInviteLink] = useState('');
  const [dropRoleBox, setDropRoleBox] = useState(false);
  const [isUniversal, setIsUniversal] = useState(true);
  const [userSearchValue, setUserSearchValue] = useState<string>('');
  const [userSearchList, setUserSearchList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const orgId = podBoard?.orgId;

  // final list to be displayed and sent to BE
  const [selectedUsersList, setSelectedUsersList] = useState([]);
  console.log(orgUserList, userList, eligibleUserList, 'all there');
  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      const userData = data.getPodUsers;
      const filteredData = userData?.map((userRole) => userRole.user);
      setUserList(filteredData || []);
      setListLoading(false);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [getOrgUsers] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: (data) => {
      const userData = data.getOrgUsers;
      const filteredData = userData?.map((userRole) => userRole.user);
      setOrgUserList(filteredData || []);
    },
    fetchPolicy: 'cache-and-network',
  });

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createPodInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
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

  const [getPodRoles, { data: podRoles }] = useLazyQuery(GET_POD_ROLES, {
    onCompleted: (data) => {
      if (data?.getPodRoles) {
        data?.getPodRoles?.forEach((role) => {
          if (role?.default) {
            console.log('pod role', role);
            setRole(role?.id);
            setActiveRole(role);
          }
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const handleRemoveFromUsersList = (item) => {
    const holdingList = selectedUsersList.filter(
      (user) => item.username !== user.username || item.email !== user.email
    );
    setSelectedUsersList(holdingList);
  };

  const handleAddUserToList = (item, type) => {
    const itemIndex = selectedUsersList.findIndex((user) => {
      if (type === 'name') {
        return item.username === user.username;
      }
      return item === user.email;
    });
    if (itemIndex >= 0) {
    } else {
      if (type === 'email') {
        setSelectedUsersList((prev) => [
          ...prev,
          { email: item, role: activeRole.name, roleId: activeRole.id, type: 'email' },
        ]);
      } else {
        setSelectedUsersList((prev) => [...prev, { ...item, role: activeRole.name, roleId: activeRole.id, type }]);
      }
      setUserSearchValue('');
    }
  };

  const handleOnClose = () => {
    onClose();
    setCopy(false);
    setLinkOneTimeUse(false);
    setInviteLink('');
    setIsUniversal(true);
    setRole('');
    setActiveRole({});
    setSelectedUsersList([]);
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

  const handleSendInvite = () => {
    const usersList = selectedUsersList
      .filter((item) => item.type !== 'email')
      .map((item) => ({ userId: item.id, roleId: item.roleId }));
    const emailList = selectedUsersList
      .filter((item) => item.type === 'email')
      .map((item) => ({ email: item.email, roleId: item.roleId }));

    if (emailList?.length) {
      sendPodEmailInvites({
        variables: {
          input: {
            expiry: null,
            emailsAndRoles: emailList,
            podId,
          },
        },
      }).then(() => {
        if (!usersList?.length) {
          setSnackbarAlertMessage('Email invites sent successfully');
          setSnackbarAlertOpen(true);
          handleOnClose();
        }
      });
    }

    if (usersList?.length) {
      batchAddUsers({
        variables: {
          input: {
            usersRoles: usersList,
            podId,
          },
        },
      }).then(() => {
        setSnackbarAlertMessage('User invites sent successfully');
        setSnackbarAlertOpen(true);
        handleOnClose();
      });
    }
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
            podRoleId: activeRole.id,
          },
        },
      });
    }
    setCopy(false);
  }, [role, createPodInviteLink, activeRole.id, linkOneTimeUse, podId, podRoles, open, getPodRoles]);
  const roles = putDefaultRoleOnTop(podRoles?.getPodRoles, permissions);

  useEffect(() => {
    if (userSearchValue) {
      const filteredList =
        eligibleUserList &&
        eligibleUserList.filter(
          (item) => item.username && item.username.toLocaleLowerCase().includes(userSearchValue.toLocaleLowerCase())
        );

      setUserSearchList(filteredList);
    } else {
      setUserSearchList(eligibleUserList);
    }
  }, [userSearchValue]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (dropRoleBox && roleContainerRef?.current && !roleContainerRef?.current.contains(e.target)) {
        setDropRoleBox(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [dropRoleBox]);

  useEffect(() => {
    if (podId) {
      getPodUsers({
        variables: {
          podId,
          limit: 1000, // TODO: paginate
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podId]);

  useEffect(() => {
    if (orgId) {
      getOrgUsers({
        variables: {
          orgId,
          limit: 1000, // TODO: paginate
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  useEffect(() => {
    if (userList.length && orgUserList.length) {
      const isSameUser = (a, b) => a.id === b.id;
      const compareFunc = (left, right, compareFunction) =>
        left.filter((leftValue) => !right.some((rightValue) => compareFunction(leftValue, rightValue)));
      const orgPodUsers = compareFunc(orgUserList, userList, isSameUser);
      setEligibleUserList([...orgPodUsers]);
    } else {
      setEligibleUserList(orgUserList);
    }
  }, [userList, orgUserList]);

  return (
    <StyledModal open={open} onClose={handleOnClose}>
      <StyledBox isUniversal={isUniversal}>
        <TopDivider>
          <HeadingWrapper>
            <IconTextWrapper>
              {/* <PersonAddIconWrapper>
              <PersonAddIcon />
            </PersonAddIconWrapper> */}
              <TextHeadingWrapper>
                <TextHeading>{!isUniversal ? 'Invite' : 'Share with people and groups'}</TextHeading>
              </TextHeadingWrapper>
            </IconTextWrapper>
            <CloseButton onClick={handleOnClose} />
          </HeadingWrapper>
          <DashedLine />

          <SelectUserContainer isUniversal={isUniversal}>
            <SearchUserBox>
              <SearchUserContainer>
                <input
                  onChange={(e) => {
                    setUserSearchValue(e.target.value);
                  }}
                  readOnly={isUniversal}
                  type="text"
                  value={isUniversal ? inviteLink : userSearchValue}
                  placeholder="Search for usernames or email..."
                />
                {!isUniversal && <SearchIcon />}
              </SearchUserContainer>
              {userSearchValue &&
                (validateEmail(userSearchValue) ? (
                  <DisplaySearchedUserContainer>
                    <DisplaySearchedUser
                      type="email"
                      onClick={() => {
                        handleAddUserToList(userSearchValue, 'email');
                      }}
                    >
                      <p>{userSearchValue}</p>
                    </DisplaySearchedUser>
                  </DisplaySearchedUserContainer>
                ) : (
                  <DisplaySearchedUserContainer>
                    {userSearchList.length ? (
                      userSearchList.map((item, i) => (
                        <DisplaySearchedUser
                          key={i}
                          onClick={() => {
                            handleAddUserToList(item, 'name');
                          }}
                        >
                          {item?.profilePicture ? (
                            <UserProfilePicture src={item?.thumbnailPicture || item?.profilePicture} />
                          ) : (
                            <DefaultProfilePicture />
                          )}
                          <p>{item.username}</p>
                        </DisplaySearchedUser>
                      ))
                    ) : (
                      <EmptySearch>Empty Search</EmptySearch>
                    )}
                  </DisplaySearchedUserContainer>
                ))}
            </SearchUserBox>
            <RoleContainer ref={roleContainerRef}>
              <SelectRoleContainer
                onClick={() => {
                  setDropRoleBox(!dropRoleBox);
                }}
                dropActive={dropRoleBox}
              >
                <RoleText role_type={activeRole.name}>{activeRole.name}</RoleText>
                <ArrowFillIcon />
              </SelectRoleContainer>
              <SelectRoleBox show={dropRoleBox}>
                {roles &&
                  roles.map((item, i) => (
                    <IndividualRoleBox
                      onClick={() => {
                        setActiveRole(item);
                        setDropRoleBox(false);
                      }}
                      key={i}
                      active={item.id === activeRole?.id}
                    >
                      <RoleText role_type={item.name}>{item.name}</RoleText>
                      <Checkbox
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                        checked={item.id === activeRole?.id}
                      />
                    </IndividualRoleBox>
                  ))}
              </SelectRoleBox>
            </RoleContainer>
          </SelectUserContainer>
          {!isUniversal && (
            <UserBox>
              <InvitedText>Invite {selectedUsersList.length} user(s)</InvitedText>
              <UsersDetailsBox>
                {selectedUsersList.map((item, i) => (
                  <IndividualUserBox key={i}>
                    <NameContainer>
                      {item.type === 'email' ? (
                        ''
                      ) : item?.profilePicture ? (
                        <UserProfilePicture src={item?.thumbnailPicture || item?.profilePicture} />
                      ) : (
                        <DefaultProfilePicture />
                      )}
                      <p>{item.type === 'email' ? item.email : item.username}</p>
                    </NameContainer>
                    <RoleDeleteContainer>
                      <RoleText role_type={item.role}>{item.role}</RoleText>
                      <DeleteBox onClick={() => handleRemoveFromUsersList(item)}>
                        <DeleteBasketIcon />
                      </DeleteBox>
                    </RoleDeleteContainer>
                  </IndividualUserBox>
                ))}{' '}
              </UsersDetailsBox>
            </UserBox>
          )}
        </TopDivider>

        <BottomBox isUniversal={isUniversal}>
          {isUniversal && (
            <CopyLinkBox>
              <LinkSwitch label="One time use" checked={linkOneTimeUse} onClick={handleLinkOneTimeUseChange} />{' '}
              <LinkFlex>
                <CancelButton
                  onClick={() => {
                    setIsUniversal(!isUniversal);
                    setCopy(false);
                  }}
                >
                  Invite by Username or Email
                </CancelButton>
                <Button onClick={handleOnCopy}>{copy ? 'Copied' : 'Copy Link'}</Button>
              </LinkFlex>
            </CopyLinkBox>
          )}
          {!isUniversal && (
            <UniversalBox>
              <UniversalLinkButton
                onClick={() => {
                  setIsUniversal(!isUniversal);
                }}
              >
                <LinkIconBox>
                  <LinkIcon />
                </LinkIconBox>
                Universal link
              </UniversalLinkButton>
              <LinkFlex>
                <Button disabled={!selectedUsersList.length} onClick={handleSendInvite}>
                  Send Invite
                </Button>
              </LinkFlex>
            </UniversalBox>
          )}
        </BottomBox>

        {/* <InviteThruLinkLabel>Invite through universal link</InviteThruLinkLabel> */}
        {/* <InviteThruLinkInputWrapper>
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
        </InviteThruLinkInputWrapper> */}
        {/* <LinkSwitch
          label="Link expires after one-time use"
          checked={linkOneTimeUse}
          onClick={handleLinkOneTimeUseChange}
        /> */}
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
