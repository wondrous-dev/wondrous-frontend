import React, { useEffect, useState } from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';

import { useLazyQuery, useQuery } from '@apollo/client';
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

const Roles = () => {
  const [newRole, setNewRole] = useState('');
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const [getOrgRoles, { data: organizationRoles }] = useLazyQuery(GET_ORG_ROLES);
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
    const { value } = e.target;

    if (value.length <= 100) {
      setNewRole(value);
    }
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
              <RoleNameInput />
              <CreateRoleButton highlighted>Create role</CreateRoleButton>
            </CreateRole>
          </RoleNameBlock>
        </RolesInputsBlock>
        <Accordion title="Select permissions">
          {permissons.map((permisson) => (
            <Permission key={permisson.title}>
              <div>
                <PermissionTitle>{permisson.title}</PermissionTitle>
                <PermissionSubtitle>{permisson.subTitle}</PermissionSubtitle>
              </div>
              <AndroidSwitch />
            </Permission>
          ))}
        </Accordion>

        {organizationRoles?.getOrgRoles.length ? (
          <LabelBlock mt={120}>{organizationRoles?.getOrgRoles.length} Existing roles</LabelBlock>
        ) : null}

        {(organizationRoles?.getOrgRoles || []).map((role) => (
          <Box mt={22}>
            <Accordion key={role.id} title={role.name}>
              {permissons.map((permisson) => (
                <Permission key={role.name}>
                  <div>
                    <PermissionTitle>{permisson.title}</PermissionTitle>
                    <PermissionSubtitle>{permisson.subTitle}</PermissionSubtitle>
                  </div>
                  <AndroidSwitch />
                </Permission>
              ))}
            </Accordion>
          </Box>
        ))}
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Roles;
