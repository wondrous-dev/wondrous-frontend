import Image from 'next/image';

import Box from '@mui/material/Box';
import MuiCheckbox, { CheckboxProps } from '@mui/material/Checkbox';

import styles from './CheckboxStyles';

const CheckMarkIcon = (
  <Box sx={styles.icon}>
    <Image src="/images/icons/checkmark.svg" alt="checkmark" width={12} height={12} />
  </Box>
);

const UncheckedIcon = <Box sx={styles.unCheckedIcon} />;
const Checkbox = ({ checked, onChange, name, sx, ...props }: CheckboxProps) => (
  <MuiCheckbox
    checked={checked}
    onChange={onChange}
    name={name}
    sx={{ ...sx, ...styles.checkbox }}
    checkedIcon={CheckMarkIcon}
    icon={UncheckedIcon}
    {...props}
  />
);

export default Checkbox;
