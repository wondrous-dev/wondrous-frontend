import {
  RequestModalRolesAbilityCheckIcon,
  RequestModalRolesAbilityCloseIcon,
  RequestModalRolesAbilityRows,
  RequestModalRolesAbilityText,
} from 'components/RoleModal/styles';
import React from 'react';

const ChecklistRow = ({ role, status }) => (
  <RequestModalRolesAbilityRows key={role}>
    {status === 'fail' ? <RequestModalRolesAbilityCloseIcon /> : <RequestModalRolesAbilityCheckIcon />}
    <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
  </RequestModalRolesAbilityRows>
);
export default ChecklistRow;
