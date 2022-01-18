import React, { useState } from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';

import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from '../../../graphql/queries/org';

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
} from './styles';

const Roles = () => {
  const [newRole, setNewRole] = useState('');
  const { data: getOrgData } = useQuery(GET_USER_ORGS);

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
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Roles;
