import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from '../../../graphql/queries/org';

import permissons from './permissons';
import {
  RolesContainer,
  CreateRole,
  CreateRoleButton,
  RoleNameBlock,
  AndroidSwitch,
  RoleNameInput,
  RolesInputsBlock,
  Permission,
  LabelBlock,
  PermissionSubtitle,
  PermissionTitle,
  Box,
} from './styles';
import { transformTaskToTaskCard } from '../../../utils/helpers';
import { CREATE_ORG_ROLE, DELETE_ORG_ROLE, UPDATE_ORG_ROLE } from '../../../graphql/mutations/org';

const Roles = () => {
  const [newRoleName, setNewRoleName] = useState('');
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const [getOrgRoles, { data: organizationRoles }] = useLazyQuery(GET_ORG_ROLES);
  const [updateOrgRole, { data: data2 }] = useMutation(UPDATE_ORG_ROLE);
  const [deleteOrgRole, { data }] = useMutation(DELETE_ORG_ROLE);
  const [createOrgRole] = useMutation(CREATE_ORG_ROLE, {
    onCompleted: (data) => {
      debugger;
    },
  });
  const firstOrganization = userOrgs?.getUserOrgs[0];

  useEffect(() => {
    if (firstOrganization) {
      getOrgRoles({
        variables: {
          orgId: firstOrganization.id,
        },
      });
    }
  }, [firstOrganization]);

  const handleNewRoleNameChange = (e) => {
    if (!newRoleName) {
      return;
    }
    console.log('-------')


    // updateOrgRole({
    //   variables: {
    //     input: {
    //       id: '45817491831652359',
    //       permissions: ['manage_pod'],
    //       name: 'efa',
    //     },
    //   },
    // });
    //
    // return;
    // deleteOrgRole({
    //   variables: {
    //     id: '45818761557573640',
    //   },
    // });
    //
    // return;
    //
    // const roleInput = {
    //   permissions: ['manage_pod'],
    //   orgId: firstOrganization.id,
    //   // org: firstOrganization,
    //   name: 'test',
    // };
    //
    // // debugger;
    // createOrgRole({
    //   variables: {
    //     input: roleInput,
    //   },
    // });

  };

  return (
    <SettingsWrapper>
      <RolesContainer>
        <HeaderBlock
          icon={<UserCheckIcon circle />}
          title="Roles"
          description="Use roles to organize contributors and admins"
        />
        <RolesInputsBlock>
          <RoleNameBlock>
            <LabelBlock>Create a new role</LabelBlock>

            <CreateRole>
              <RoleNameInput value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
              <CreateRoleButton onClick={handleNewRoleNameChange} disabled={!newRoleName} highlighted={!!newRoleName}>
                Create role
              </CreateRoleButton>
            </CreateRole>
          </RoleNameBlock>
        </RolesInputsBlock>
        <Accordion title="Select permissions" disabled={!newRoleName}>
          {/*{permissons.map((permisson) => (*/}
          {/*  <Permission key={permisson.title}>*/}
          {/*    <div>*/}
          {/*      <PermissionTitle>{permisson.title}</PermissionTitle>*/}
          {/*      <PermissionSubtitle>{permisson.subTitle}</PermissionSubtitle>*/}
          {/*    </div>*/}
          {/*    <AndroidSwitch />*/}
          {/*  </Permission>*/}
          {/*))}*/}
        </Accordion>

        {/*{organizationRoles?.getOrgRoles.length ? (*/}
        {/*  <LabelBlock mt={120}>{organizationRoles?.getOrgRoles.length} Existing roles</LabelBlock>*/}
        {/*) : null}*/}

        {/*{(organizationRoles?.getOrgRoles || []).map((role) => (*/}
        {/*  <Box mt={22}>*/}
        {/*    <Accordion key={role.id} title={role.name}>*/}
        {/*      {permissons.map((permisson) => (*/}
        {/*        <Permission key={role.name}>*/}
        {/*          <div>*/}
        {/*            <PermissionTitle>{permisson.title}</PermissionTitle>*/}
        {/*            <PermissionSubtitle>{permisson.subTitle}</PermissionSubtitle>*/}
        {/*          </div>*/}
        {/*          <AndroidSwitch />*/}
        {/*        </Permission>*/}
        {/*      ))}*/}

        {/*      <LabelBlock>Delete role</LabelBlock>*/}
        {/*    </Accordion>*/}
        {/*  </Box>*/}
        {/*))}*/}
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Roles;
