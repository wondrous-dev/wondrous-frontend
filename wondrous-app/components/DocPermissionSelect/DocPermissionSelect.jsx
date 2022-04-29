import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { inputStyles, menuItemStyles } from './DocPermissionSelectStyles';

const SAMPLE_PERMISSIONS = [
  {
    label: 'Admin Only',
    value: 'admin',
  },
  {
    label: 'Collaborators',
    value: 'collaborators',
  },
];

const StyledTextField = styled(TextField)(inputStyles);
const StyledMenuItem = styled(MenuItem)(menuItemStyles);

const DocPermissionSelect = ({ register, errors }) => (
  <StyledTextField
    select
    {...register}
    fullWidth
    helperText={errors.permission && errors.permission.message}
    error={errors.permission}
  >
    {SAMPLE_PERMISSIONS.map((option) => (
      <StyledMenuItem key={option.value} value={option.value}>
        {option.label}
      </StyledMenuItem>
    ))}
  </StyledTextField>
);

export default DocPermissionSelect;
