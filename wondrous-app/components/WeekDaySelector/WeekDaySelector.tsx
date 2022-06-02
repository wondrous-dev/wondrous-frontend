import Image from 'next/image';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import styles from './WeekDaySelectorStyles';

const CheckMarkIcon = (
  <Box sx={styles.icon}>
    <Image src="/images/icons/checkmark.svg" alt="checkmark" width="8px" height="8px" />
  </Box>
);

const WeekDaySelector = ({ onWeekDaysChange, weekDaysSelected }) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = weekDaysSelected;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
        <FormLabel component="legend" sx={styles.label}>
          On these days
        </FormLabel>
        <FormGroup sx={styles.formGroup}>
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={monday}
                onChange={onWeekDaysChange}
                name="monday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="M"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={tuesday}
                onChange={onWeekDaysChange}
                name="tuesday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={wednesday}
                onChange={onWeekDaysChange}
                name="wednesday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="W"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={thursday}
                onChange={onWeekDaysChange}
                name="thursday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={friday}
                onChange={onWeekDaysChange}
                name="friday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="F"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={saturday}
                onChange={onWeekDaysChange}
                name="saturday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="S"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={
              <Checkbox
                checked={sunday}
                onChange={onWeekDaysChange}
                name="sunday"
                sx={styles.checkbox}
                checkedIcon={CheckMarkIcon}
              />
            }
            label="S"
            labelPlacement="bottom"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default WeekDaySelector;
