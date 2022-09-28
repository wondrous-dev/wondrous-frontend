import {
  RequestModalRolesAbilityCheckIcon,
  RequestModalRolesAbilityCloseIcon,
  RequestModalRolesAbilityRows,
  RequestModalRolesAbilityText,
} from 'components/RoleModal/styles';
import { PERMISSION_TO_DISPLAY } from 'utils/constants';
import React from 'react';

const ChecklistRow = ({ role, status }) => (
  <RequestModalRolesAbilityRows key={role}>
    {status === 'fail' ? <RequestModalRolesAbilityCloseIcon /> : <RequestModalRolesAbilityCheckIcon />}
    <RequestModalRolesAbilityText>{PERMISSION_TO_DISPLAY[role]}</RequestModalRolesAbilityText>
  </RequestModalRolesAbilityRows>
);
export default ChecklistRow;
