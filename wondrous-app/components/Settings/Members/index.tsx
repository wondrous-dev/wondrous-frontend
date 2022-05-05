import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { uniq } from 'lodash';
import Link from 'next/link';
import pluralize from 'pluralize';
import { format } from 'date-fns';

import { GET_ORG_BY_ID, GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from 'graphql/queries/org';
import { GET_POD_BY_ID } from 'graphql/queries/pod';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { UPDATE_USER_ORG_ROLE } from 'graphql/mutations/org';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import MembersIcon from '../../Icons/membersSettings';
import { RolesContainer } from '../Roles/styles';
import { StyledTableCell, StyledTableContainer, StyledTableHead, StyledTableRow } from '../../Table/styles';
import { useRouter } from 'next/router';
import {
  DefaultProfilePicture,
  InviteDiv,
  SeeMoreText,
  StyledTableHeaderCell,
  StyledTable,
  StyledTableBody,
  PodsCount,
} from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
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
import MemberRoles from './MemberRoles';
import { SnackbarAlertContext } from '../../Common/SnackbarAlert';
import { Text } from 'components/styled';
import Grid from '@mui/material/Grid';
import { TaskMenuIcon } from 'components/Icons/taskMenu';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';

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

  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        // background: '#0F0F0F',
        borderRadius: '6px',
        border: '1px solid #6A6A6A',
        // maxHeight: '250px',
        // width: '100%',
        // maxWidth: 260,
        background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
        padding: '0 7px',
        //
        // '*::-webkit-scrollbar': {
        //   width: 100,
        // },
      },
    },
  };

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
      MenuProps={MenuProps}
      IconComponent={() => <ArrowDropDownIcon style={{ height: '7px' }} fill="#CCBBFF" />}
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
  const [userRoles, setUserRoles] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    fetchPolicy: 'network-only',
  });

  const [getPod, { data: podData }] = useLazyQuery(GET_POD_BY_ID);
  const [getOrg, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      const userRoles = uniq(users.map((user) => user?.role?.name));

      setUserRoles(userRoles);
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
          const userRoles = users ? uniq(users.map((user) => user?.role?.name)) : [];

          setUserRoles(userRoles);
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
  const canRemoveUsers = false;

  return (
    <SettingsWrapper>
      <RolesContainer>
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
        {podId && <InviteMember users={users} setUsers={setUsers} orgId={orgId} podId={podId} roleList={roleList} />}

        <MemberRoles userRoles={userRoles} isDAO={!!orgId} />

        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell width="40%">Currency</StyledTableHeaderCell>
                <StyledTableHeaderCell width="25%">Role</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%">Pods</StyledTableHeaderCell>
                <StyledTableHeaderCell width="15%">Last Active</StyledTableHeaderCell>
                {canRemoveUsers ? <StyledTableHeaderCell width="5%">Edit</StyledTableHeaderCell> : null}
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {users ? (
                users.map(({ user, role }) => {
                  return (
                    <StyledTableRow key={user?.username}>
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
                          userId={user?.id}
                          orgId={orgId}
                          podId={podId}
                          existingRole={role}
                          roleList={roleList}
                          username={user?.username}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <PodsCount>
                          {user?.additionalInfo?.podCount || 'N/A'} {pluralize('Pod', user?.additionalInfo?.podCount)}{' '}
                        </PodsCount>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Text color="white" fontSize="14px">
                          {user?.additionalInfo?.streak?.lastActiveAt
                            ? format(new Date(user?.additionalInfo?.streak?.lastActiveAt), 'MM/dd/yyyy')
                            : 'None'}
                        </Text>
                      </StyledTableCell>

                      {canRemoveUsers ? (
                        <StyledTableCell>
                          <DropDown DropdownHandler={TaskMenuIcon}>
                            <DropDownItem
                              onClick={() => {}}
                              style={{
                                color: White,
                              }}
                            >
                              Remove Member
                            </DropDownItem>
                          </DropDown>
                        </StyledTableCell>
                      ) : null}
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
