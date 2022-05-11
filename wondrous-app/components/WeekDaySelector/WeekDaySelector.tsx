import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import styles from './WeekDaySelectorStyles';
import useEffect from 'react';

const WeekDaySelector = ({ onWeekDaysChange, weekDaysSelected }) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = weekDaysSelected;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">On these days</FormLabel>
        <FormGroup sx={{ flexDirection: 'row' }}>
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={monday} onChange={onWeekDaysChange} name="monday" />}
            label="M"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={tuesday} onChange={onWeekDaysChange} name="tuesday" />}
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={wednesday} onChange={onWeekDaysChange} name="wednesday" />}
            label="W"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={thursday} onChange={onWeekDaysChange} name="thursday" />}
            label="T"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={friday} onChange={onWeekDaysChange} name="friday" />}
            label="F"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={saturday} onChange={onWeekDaysChange} name="saturday" />}
            label="S"
            labelPlacement="bottom"
          />
          <FormControlLabel
            sx={{ ml: 0, mr: 0 }}
            control={<Checkbox checked={sunday} onChange={onWeekDaysChange} name="sunday" />}
            label="S"
            labelPlacement="bottom"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default WeekDaySelector;
