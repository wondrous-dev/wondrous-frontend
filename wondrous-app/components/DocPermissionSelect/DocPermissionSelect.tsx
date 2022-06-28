import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import styles, { inputStyles, menuItemStyles } from './DocPermissionSelectStyles';
import { DOCS_PERMISSIONS } from 'utils/constants';

const StyledTextField = styled(TextField)(inputStyles);
const StyledMenuItem = styled(MenuItem)(menuItemStyles);

const DocPermissionSelect = ({ register, errors, defaultValue }) => (
  <StyledTextField
    select
    {...register}
    fullWidth
    helperText={errors.visibility?.message}
    error={errors.visibility}
    SelectProps={{ MenuProps: { MenuListProps: { sx: { ...styles.menuList } } } }}
    defaultValue={defaultValue}
  >
    {DOCS_PERMISSIONS.map((option) => (
      <StyledMenuItem key={option.value} value={option.value}>
        {option.label}
      </StyledMenuItem>
    ))}
  </StyledTextField>
);

export default DocPermissionSelect;
