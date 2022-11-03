import Image from 'next/legacy/image';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from 'components/Checkbox';

import styles from './WeekDaySelectorStyles';

function WeekDaySelector({ onWeekDaysChange, weekDaysSelected }) {
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
            control={<Checkbox checked={monday} onChange={onWeekDaysChange} name="monday" />}
            label="M"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={tuesday} onChange={onWeekDaysChange} name="tuesday" />}
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={wednesday} onChange={onWeekDaysChange} name="wednesday" />}
            label="W"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={thursday} onChange={onWeekDaysChange} name="thursday" />}
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={friday} onChange={onWeekDaysChange} name="friday" />}
            label="F"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={saturday} onChange={onWeekDaysChange} name="saturday" />}
            label="S"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={styles.formControlLabel}
            control={<Checkbox checked={sunday} onChange={onWeekDaysChange} name="sunday" />}
            label="S"
            labelPlacement="bottom"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
}

export default WeekDaySelector;
