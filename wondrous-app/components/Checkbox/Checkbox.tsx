import Image from 'next/image';

import Box from '@mui/material/Box';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';

import styles from './CheckboxStyles';

const CheckMarkIcon = (
  <Box sx={styles.icon}>
    <Image src="/images/icons/checkmark.svg" alt="checkmark" width={10} height={10} />
  </Box>
);

const Checkbox = ({ checked, onChange, name, sx, ...props }: CheckboxProps) => (
  <MuiCheckbox
    checked={checked}
    onChange={onChange}
    name={name}
    sx={{ ...sx, ...styles.checkbox }}
    checkedIcon={CheckMarkIcon}
    {...props}
  />
);

export default Checkbox;
