import React, { useEffect, useState } from 'react';
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
import { DefaultProfilePicture, UserInfoDiv, UsernameText, UserProfilePicture } from './styles';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import CreatePodIcon from '../../Icons/createPod';
import { CircularProgress } from '@material-ui/core';

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
  const { existingRole, roleList, userId, orgId } = props;
  const [role, setRole] = useState(existingRole?.id);
  const [updateUserOrgRole] = useMutation(UPDATE_USER_ORG_ROLE);
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
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Members;
