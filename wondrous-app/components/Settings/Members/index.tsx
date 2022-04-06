import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from 'graphql/queries/org';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';
import Switch from '../../Common/Switch';
import { RolesContainer } from '../Roles/styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  TaskDescription,
  TaskTitle,
} from '../../Table/styles';
import { useRouter } from 'next/router';
import { DefaultProfilePicture, InviteDiv, SeeMoreText, UserInfoDiv, UsernameText, UserProfilePicture } from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import CreatePodIcon from '../../Icons/createPod';
import { CircularProgress, TextField } from '@material-ui/core';
import { PERMISSIONS } from 'utils/constants';
import { useSettings } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { INVITE_USER_TO_POD, UPDATE_USER_POD_ROLE } from 'graphql/mutations/pod';
import { GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import {
  AutocompleteList,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormPreviewButton,
  OptionDiv,
  OptionTypography,
  StyledAutocomplete,
} from '../../CreateEntity/styles';
import { White } from '../../../theme/colors';
import { SafeImage } from '../../Common/Image';
import { filterOrgUsers } from '../../CreateEntity/createEntityModal';
import { SnackbarAlertContext } from '../../Common/SnackbarAlert';
import { ArchivedTaskUndo } from '../../Common/Task/styles';
import Link from 'next/link';

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
                color: White,
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

const Members = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [users, setUsers] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);

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
      getOrgUsers({
        variables: {
          orgId,
          limit: LIMIT,
        },
      }).then((result) => {
        if (!firstTimeFetch) {
          setUsers(result?.data?.getOrgUsers);
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

  return (
    <SettingsWrapper>
      <RolesContainer>
        <HeaderBlock icon={<UserCheckIcon circle />} title="Members" description="View and edit roles of members" />
        {podId && <InviteMember users={users} setUsers={setUsers} orgId={orgId} podId={podId} roleList={roleList} />}
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="30%">
                  User
                </StyledTableCell>
                <StyledTableCell align="center" width="30%">
                  Role
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {loading && <CircularProgress />}
            </div>
            <StyledTableBody>
              {users &&
                users.map((user) => {
                  return (
                    <StyledTableRow key={user?.id}>
                      <StyledTableCell>
                        <Link href={`/profile/${user?.user?.username}/about`} passHref>
                          <UserInfoDiv
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            {user?.user?.profilePicture ? (
                              <UserProfilePicture src={user?.user?.profilePicture} />
                            ) : (
                              <DefaultProfilePicture />
                            )}
                            <UsernameText>{user?.user?.username}</UsernameText>
                          </UserInfoDiv>
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>
                        <MemberRoleDropdown
                          userId={user?.user?.id}
                          orgId={orgId}
                          podId={podId}
                          existingRole={user?.role}
                          roleList={roleList}
                          username={user?.user?.username}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
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
