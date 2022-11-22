import { Grid } from '@mui/material';
import CalendarIcon from 'components/Icons/calendar';
import { format } from 'date-fns';
import palette from 'theme/palette';

const TaskCardDate = ({ date }) => {
  if (!date) return null;
  return (
    <Grid
      container
      bgcolor={palette.grey99}
      width="fit-content"
      borderRadius="4px"
      fontSize="13px"
      fontWeight="500"
      alignItems="center"
      gap="4px"
      padding="6px"
      height="28px"
      lineHeight="0"
      color="#fff"
    >
      <CalendarIcon width="10px" height="11px" />
      {format(new Date(date), 'MMM d')}
    </Grid>
  );
};

export default TaskCardDate;
