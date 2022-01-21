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

const LIMIT = 2;

const filterRoles = (roles) => {
  if (!roles) {
    return [];
  }
  return roles.map((role) => ({
    label: role?.name,
    value: role?.id,
  }));
};

const MemberRoleDropdown = (props) => {
  const { existingRole, roleList, userId, username, orgId } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
  const isOwner = existingRole?.permissions.includes(PERMISSIONS.FULL_ACCESS);
  const settings = useSettings();
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
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
        updateUserOrgRole({
          variables: {
            input: {
              userId,
              orgId,
              roleId,
            },
          },
        });
      }}
      labelText="Choose Role"
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
  const { orgId } = router.query;
  const [hasMore, setHasMore] = useState(false);
  const [orgUsers, setOrgUsers] = useState([]);
  const [getOrgUsers, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: (data) => {
      setOrgUsers(data?.getOrgUsers);
      setHasMore(data?.hasMore || data?.getOrgUsers.length >= LIMIT);
    },
    fetchPolicy: 'network-only',
  });
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
    }
  }, [orgId]);
  const roleList = orgRoleData?.getOrgRoles;

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      fetchMore({
        variables: {
          offset: roleList.length,
          limit: LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const hasMore = fetchMoreResult.getOrgUsers.length >= LIMIT;
          if (!fetchMoreResult) {
            return prev;
          }
          if (!hasMore) {
            setHasMore(false);
          }
          return {
            hasMore,
            getOrgUsers: prev.getOrgUsers.concat(fetchMoreResult.getOrgUsers),
          };
        },
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [hasMore, roleList, fetchMore]);

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
              {orgUsers &&
                orgUsers.map((orgUser) => {
                  return (
                    <StyledTableRow key={orgUser?.id}>
                      <StyledTableCell>
                        <UserInfoDiv>
                          {orgUser?.user?.profilePicture ? (
                            <UserProfilePicture src={orgUser?.user?.profilePicture} />
                          ) : (
                            <DefaultProfilePicture />
                          )}
                          <UsernameText>{orgUser?.user?.username}</UsernameText>
                        </UserInfoDiv>
                      </StyledTableCell>
                      <StyledTableCell>
                        <MemberRoleDropdown
                          userId={orgUser?.user?.id}
                          orgId={orgId}
                          existingRole={orgUser?.role}
                          roleList={roleList}
                          username={orgUser?.user?.username}
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
