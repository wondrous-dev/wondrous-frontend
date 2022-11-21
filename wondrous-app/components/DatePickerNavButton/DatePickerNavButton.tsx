import Box from '@mui/material/Box';
import Image from 'next/image';

import styles from './DatePickerNavButtonStyles';

interface DatePickerNavButtonProps {
  prev?: boolean;
  next?: boolean;
}

function DatePickerNavButton({ prev, next }: DatePickerNavButtonProps) {
  return (
    <Box sx={{ ...styles.root, ...(prev && styles.prev), ...(next && styles.next) }}>
      <Image src="/images/icons/arrow.svg" alt="calendar button" width={8} height={16} />
    </Box>
  );
}

export default DatePickerNavButton;
