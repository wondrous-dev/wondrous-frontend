import { ChevronLeft } from '@mui/icons-material';
import Box from '@mui/material/Box';

const styles = {
  root: {
    color: 'white',
    background: '#84BCFF',
    borderRadius: ' 6px',
    width: 26,
    height: 26,
    position: 'absolute',
    top: '21px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prev: {
    left: '26px',
  },
  next: {
    right: '28px',
    transform: 'rotate(180deg)',
  },
};

interface DatePickerNavButtonProps {
  prev?: boolean;
  next?: boolean;
}

function DatePickerNavButton({ prev, next }: DatePickerNavButtonProps) {
  return (
    <Box
      sx={{
        ...styles.root,
        ...(prev && styles.prev),
        ...(next && styles.next),
      }}
    >
      <ChevronLeft
        sx={{
          width: '8px',
        }}
      />
    </Box>
  );
}

export default DatePickerNavButton;
