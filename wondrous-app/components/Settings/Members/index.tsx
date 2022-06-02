import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import pluralize from 'pluralize';

import { GET_ORG_BY_ID, GET_ORG_ROLES, GET_ORG_USERS, SEARCH_ORG_USERS } from 'graphql/queries/org';
import { GET_POD_BY_ID, GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import MembersIcon from '../../Icons/membersSettings';
import { RolesContainer } from '../Roles/styles';
import { StyledTableCell, StyledTableContainer, StyledTableHead, StyledTableRow } from '../../Table/styles';
import { useRouter } from 'next/router';
import {
  DefaultProfilePicture,
  PodsCount,
  SeeMoreText,
  StyledTable,
  StyledTableBody,
  StyledTableHeaderCell,
} from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import CreatePodIcon from '../../Icons/createPod';
import { CircularProgress, TextField } from '@mui/material';
import { PERMISSIONS } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { INVITE_USER_TO_POD, KICK_POD_USER, UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import {
  AutocompleteList,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormPreviewButton,
  OptionDiv,
  OptionTypography,
  StyledAutocomplete,
} from '../../CreateEntity/styles';
import { white } from 'theme/colors';
import { SafeImage } from '../../Common/Image';
import InviteMember from './InviteMember';
import MemberRoleDropdown from './MemberRoleDropdown';
import MemberRoles from '../MemberRoles';
import { Text } from 'components/styled';
import Grid from '@mui/material/Grid';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import { KICK_ORG_USER, UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import ConfirmModal, { SubmitButtonStyle } from 'components/Common/ConfirmModal';

const LIMIT = 10;

const filterRoles = (roles, isOwner, userIsOwner) => {
  if (!roles) {
    return [];
  }
  return roles
    .filter((role) => {
      if (isOwner) {
        return true;
      }
      const hasOwnerPermissions = role?.permissions?.includes(PERMISSIONS.FULL_ACCESS);
      if (hasOwnerPermissions) {
        if (userIsOwner) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    })
    .map((role) => {
      return { label: role?.name, value: role?.id };
    });
};
const MemberRoleDropdown = (props) => {
  const { existingRole, roleList, userId, podId, isPod } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE);
  const isOwner = existingRole?.permissions.includes(PERMISSIONS.FULL_ACCESS);
  const settings = useSettings();
  let orgId = props?.orgId || settings?.pod?.orgId;
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
  return (
    <DropdownSelect
      value={role}
      setValue={(roleId) => {
        setRole(roleId);
        if (podId) {
          updateUserPodRole({
            variables: {
              input: {
                userId,
                podId,
                roleId,
              },
            },
          });
        } else {
          updateUserOrgRole({
            variables: {
              input: {
                userId,
                orgId,
                roleId,
              },
            },
          });
        }
      }}
      labelText={isOwner && !role ? 'Owner' : 'Choose your role'}
      options={filterRoles(roleList, isOwner, userIsOwner)}
      disabled={isOwner}
      formSelectStyle={{
        height: 'auto',
        marginTop: '-20px',
      }}
      innerStyle={{
        zIndex: '0',
      }}
    />
  );
};

const InviteMember = (props) => {
  const { podId, roleList, setUsers, users } = props;
  const [inviteeRole, setInviteeRole] = useState(null);
  const [invitee, setInvitee] = useState(null);
  const [inviteeString, setInviteeString] = useState('');
  const settings = useSettings();
  let orgId = props?.orgId || settings?.pod?.orgId;
  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
    podId,
  });
  const [inviteUserToPod] = useMutation(INVITE_USER_TO_POD);
  const canInvite = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.MANAGE_MEMBER);
  const userIsOwner = permissions.includes(PERMISSIONS.FULL_ACCESS);
  const searchedUsers = searchOrgUserResults?.searchOrgUsers;
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  useEffect(() => {
    if (roleList) {
      const roles = filterRoles(roleList, null, userIsOwner);
      setInviteeRole(roles[0].value);
    }
  }, [roleList]);

  if (!canInvite) {
    return null;
  }

  const userIds = users.map((user) => user?.user?.id);

  const filterOrgUsersForAutocomplete = (users) => {
    if (!users) {
      return [];
    }
    return users
      .filter((user) => {
        if (userIds.includes(user?.id)) {
          return false;
        }
        return true;
      })
      .map((user) => ({
        ...user,
        profilePicture: user?.profilePicture,
        label: user?.username,
        value: user?.id,
      }));
  };

  return (
    <InviteDiv>
      <CreateFormAddDetailsInputBlock
        style={{
          width: 'auto',
          flex: 1,
        }}
      >
        <CreateFormAddDetailsInputLabel>Username</CreateFormAddDetailsInputLabel>
        <StyledAutocomplete
          options={filterOrgUsersForAutocomplete(searchedUsers) || []}
          renderInput={(params) => (
            <TextField
              style={{
                color: white,
                fontFamily: 'Space Grotesk',
                fontSize: '14px',
                paddingLeft: '4px',
              }}
              placeholder="Enter username..."
              InputLabelProps={{ shrink: false }}
              {...params}
            />
          )}
          PopperComponent={AutocompleteList}
          value={invitee}
          inputValue={inviteeString}
          onInputChange={(event, newInputValue) => {
            searchOrgUsers({
              variables: {
                orgId,
                queryString: newInputValue,
              },
            });
            setInviteeString(newInputValue);
          }}
          renderOption={(props, option, state) => {
            return (
              <OptionDiv
                onClick={(event) => {
                  setInvitee(option);
                  props?.onClick(event);
                }}
              >
                {option?.profilePicture && (
                  <SafeImage
                    src={option?.profilePicture}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '15px',
                    }}
                  />
                )}
                <OptionTypography>{option?.label}</OptionTypography>
              </OptionDiv>
            );
          }}
        />
      </CreateFormAddDetailsInputBlock>
      <DropdownSelect
        title="Role"
        titleStyle={{
          marginBottom: '-8px',
        }}
        value={inviteeRole}
        setValue={setInviteeRole}
        labelText="Choose Role"
        options={filterRoles(roleList, null, userIsOwner)}
        formSelectStyle={{
          width: 'auto',
          flex: 1,
          maxWidth: 'none',
        }}
      />
      <CreateFormPreviewButton
        onClick={() => {
          inviteUserToPod({
            variables: {
              userId: invitee?.id,
              roleId: inviteeRole,
              podId,
            },
            onCompleted: (data) => {
              const userPod = data?.inviteUserToPod;
              setUsers([userPod, ...users]);
            },
          });
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(<>{invitee?.username} invited!</>);
        }}
        style={{
          marginTop: '28px',
        }}
      >
        Invite Member
      </CreateFormPreviewButton>
    </InviteDiv>
  );
};

const useKickMember = (orgId, podId, users, setUsers) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const kickMemberSuccessful = () => {
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(<>Member kicked successfully!</>);
  };
  const [kickOrgUser] = useMutation(KICK_ORG_USER, {
    onCompleted: kickMemberSuccessful,
  });
  const [kickPodUser] = useMutation(KICK_POD_USER, {
    onCompleted: kickMemberSuccessful,
  });
  const handleKickMember = (userId) => {
    setUsers(users.filter((user) => user?.user?.id !== userId));
    if (orgId) {
      kickOrgUser({
        variables: {
          orgId,
          userId,
        },
      });
    }
    if (podId) {
      kickPodUser({
        variables: {
          podId,
          userId,
        },
      });
    }
  };
  return handleKickMember;
};

const Members = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [userToRemove, setUserToRemove] = useState(null);
  const [users, setUsers] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const [getOrg, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      setUsers(data?.getPodUsers);
      setHasMore(data?.hasMore || data?.getPodUsers.length >= LIMIT);
    },
    fetchPolicy: 'network-only',
  });

  const [getPodRoles, { data: podRoleData }] = useLazyQuery(GET_POD_ROLES);
  const [getOrgRoles, { data: orgRoleData }] = useLazyQuery(GET_ORG_ROLES);
  const roleList = podRoleData?.getPodRoles || orgRoleData?.getOrgRoles;
  useEffect(() => {
    if (orgId) {
      getOrg({
        variables: {
          orgId,
        },
      });

      getOrgUsers({
        variables: {
          orgId,
          limit: LIMIT,
        },
      }).then((result) => {
        if (!firstTimeFetch) {
          const users = result?.data?.getOrgUsers;
          setUsers(users);
          setHasMore(result?.data?.hasMore || result?.data?.getOrgUsers.length >= LIMIT);
          setFirstTimeFetch(true);
        }
      });
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    } else if (podId) {
      getPod({
        variables: {
          podId,
        },
      });
      getPodUsers({
        variables: {
          podId,
          limit: LIMIT,
        },
      });
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [orgId, podId]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: users.length,
          limit: LIMIT,
        },
      })
        .then((fetchMoreResult) => {
          if (orgId) {
            const orgUsers = fetchMoreResult?.data?.getOrgUsers;
            const hasMore = orgUsers.length >= LIMIT;
            setUsers([...users, ...orgUsers]);
            if (!hasMore) {
              setHasMore(false);
            }
          } else if (podId) {
            const podUsers = fetchMoreResult?.data?.getPodUsers;
            const hasMore = podUsers.length >= LIMIT;
            setUsers([...users, ...podUsers]);
            if (!hasMore) {
              setHasMore(false);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [hasMore, users, fetchMore, orgId, podId]);

  const orgOrPodName = orgData?.getOrgById?.name || podData?.getPodById?.name;
  const handleKickMember = useKickMember(orgId, podId, users, setUsers);

  return (
    <SettingsWrapper showPodIcon={false}>
      <RolesContainer>
        <ConfirmModal
          open={!!userToRemove}
          onClose={() => setUserToRemove(null)}
          onSubmit={() => {
            handleKickMember(userToRemove.id);
            setUserToRemove(null);
          }}
          title="Remove user from Wonder?"
          submitLabel="Remove user"
          submitButtonStyle={SubmitButtonStyle.Delete}
        >
          <Text color="#C4C4C4" fontSize="16px">
            This will remove the user ‘
            <Text color="white" as="strong">
              {userToRemove?.firstName} {userToRemove?.lastName}
            </Text>
            ‘ from this DAO. This action cannot be undone.
          </Text>
        </ConfirmModal>

        <HeaderBlock
          icon={<MembersIcon circle />}
          title={
            <>
              Members&nbsp;
              {orgOrPodName ? (
                <Text as="span">
                  {' '}
                  of{' '}
                  <Text as="span" color="#CCBBFF">
                    {orgOrPodName}
                  </Text>
                </Text>
              ) : null}
            </>
          }
          description="Use roles to organize contributors and admins"
        />

        <MemberRoles users={users} roleList={roleList} isDAO={!!orgId} />

        {podId ? (
          <InviteMember users={users} setUsers={setUsers} orgId={orgId} podId={podId} roleList={roleList} />
        ) : null}

        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell width="50%">Members</StyledTableHeaderCell>
                <StyledTableHeaderCell width="30%">Role</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%">Pods</StyledTableHeaderCell>
                <StyledTableHeaderCell width="5%">Edit</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {users ? (
                users.map(({ user, role }) => {
                  const userId = user?.id;

                  return (
                    <StyledTableRow key={userId}>
                      <StyledTableCell>
                        <Link href={`/profile/${user?.username}/about`} passHref>
                          <Grid container direction="row" alignItems="center" style={{ cursor: 'pointer' }}>
                            {user?.thumbnailPicture ? (
                              <SafeImage
                                src={user?.thumbnailPicture}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  marginRight: '10px',
                                }}
                              />
                            ) : (
                              <DefaultProfilePicture />
                            )}

                            <Grid direction="column" alignItems="center">
                              <Text color="white" fontSize={15} fontWeight={700} lineHeight="20px">
                                {user?.firstName} {user?.lastName}
                              </Text>

                              <Text color="#C4C4C4" fontSize={12} lineHeight="17px">
                                @{user?.username}
                              </Text>
                            </Grid>
                          </Grid>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <MemberRoleDropdown
                          userId={userId}
                          orgId={orgId}
                          podId={podId}
                          existingRole={role}
                          roleList={roleList}
                          username={user?.username}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <PodsCount>
                          {user?.additionalInfo?.podCount || 0} {pluralize('Pod', user?.additionalInfo?.podCount || 0)}{' '}
                        </PodsCount>
                      </StyledTableCell>

                      <StyledTableCell>
                        <DropDown DropdownHandler={TaskMenuIcon}>
                          <DropDownItem
                            onClick={() => setUserToRemove(user)}
                            style={{
                              color: white,
                            }}
                          >
                            Remove Member
                          </DropDownItem>
                        </DropDown>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colspan={5} align="center">
                    <CircularProgress />
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
        {hasMore && (
          <div
            style={{
              textAlign: 'center',
            }}
            onClick={() => handleLoadMore()}
          >
            <SeeMoreText>See more</SeeMoreText>
          </div>
        )}
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Members;
