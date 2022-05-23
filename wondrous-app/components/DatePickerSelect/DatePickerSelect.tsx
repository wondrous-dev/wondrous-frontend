import TextField from '@mui/material/TextField';

import styles from './DatePickerSelectStyles';

const DatePickerSelect = (props) => {
  return (
    <TextField
      {...props}
      sx={styles.root}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            style: {
              maxHeight: 200,
              width: 100,
            },
          },
          MenuListProps: { sx: { ...styles.menuList } },
        },
      }}
    />
  );
};

export default DatePickerSelect;
