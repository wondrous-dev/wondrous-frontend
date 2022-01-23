import React, { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from '../../../graphql/queries/org';
import { UPDATE_USER_ORG_ROLE } from '../../../graphql/mutations/org';
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
import { DefaultProfilePicture, SeeMoreText, UserInfoDiv, UsernameText, UserProfilePicture } from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import CreatePodIcon from '../../Icons/createPod';
import { CircularProgress } from '@material-ui/core';
import { PERMISSIONS } from '../../../utils/constants';
import { useSettings } from '../../../utils/hooks';
import { parseUserPermissionContext } from '../../../utils/helpers';
import { UPDATE_USER_POD_ROLE } from '../../../graphql/mutations/pod';
import { GET_POD_ROLES, GET_POD_USERS } from '../../../graphql/queries/pod';

const LIMIT = 10;

const MemberRoleDropdown = (props) => {
  const { existingRole, roleList, userId, orgId, podId, isPod } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const [updateUserPodRole] = useMutation(UPDATE_USER_POD_ROLE);
  const isOwner = existingRole?.permissions.includes(PERMISSIONS.FULL_ACCESS);
  const settings = useSettings();
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
    podId,
  });

  const userIsOwner = permissions.includes(PERMISSIONS.FULL_ACCESS);

  const filterRoles = (roles) => {
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
      options={filterRoles(roleList)}
      disabled={isOwner}
      formSelectStyle={{
        height: 'auto',
        marginTop: '-20px',
      }}
    />
  );
};

const Members = (props) => {
  const router = useRouter();
  const { orgId, podId } = router.query;
  const [hasMore, setHasMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: (data) => {
      if (!firstTimeFetch) {
        setUsers(data?.getOrgUsers);
        setHasMore(data?.hasMore || data?.getOrgUsers.length >= LIMIT);
        setFirstTimeFetch(true);
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getPodUsers] = useLazyQuery(GET_POD_USERS, {
    onCompleted: (data) => {
      setUsers(data?.getPodUsers);
      setHasMore(data?.hasMore || data?.getPodUsers.length >= LIMIT);
    },
    fetchPolicy: 'network-only',
  });

  const [getPodRoles, { data: podRoleData }] = useLazyQuery(GET_POD_ROLES);
  const [getOrgRoles, { data: orgRoleData }] = useLazyQuery(GET_ORG_ROLES);

  useEffect(() => {
    if (orgId) {
      getOrgUsers({
        variables: {
          orgId,
          limit: LIMIT,
        },
      });
      getOrgRoles({
        variables: {
          orgId,
        },
      });
    } else if (podId) {
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
  const roleList = podRoleData?.getPodRoles || orgRoleData?.getOrgRoles;
  const settings = useSettings();
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
            if (hasMore) {
              setUsers([...users, ...orgUsers]);
            } else {
              setHasMore(false);
            }
          } else if (podId) {
            const podUsers = fetchMoreResult?.data?.getPodUsers;
            const hasMore = podUsers.length >= LIMIT;
            if (hasMore) {
              setUsers([...users, ...podUsers]);
            } else {
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
                        <UserInfoDiv>
                          {user?.user?.profilePicture ? (
                            <UserProfilePicture src={user?.user?.profilePicture} />
                          ) : (
                            <DefaultProfilePicture />
                          )}
                          <UsernameText>{user?.user?.username}</UsernameText>
                        </UserInfoDiv>
                      </StyledTableCell>
                      <StyledTableCell>
                        <MemberRoleDropdown
                          userId={user?.user?.id}
                          orgId={orgId || settings?.pod?.orgId}
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
