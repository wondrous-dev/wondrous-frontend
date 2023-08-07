import Grid from '@mui/material/Grid';
import CalendarIcon from 'components/Icons/calendar';
import { format } from 'date-fns';
import moment from 'moment';
import palette from 'theme/palette';

const TaskCardDate = ({ date }) => {
  if (!date) return null;
  const formattedDate = moment.utc(date).format('MMM D');

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
      color={palette.white}
    >
      <CalendarIcon width="10px" height="11px" />
      {formattedDate}
    </Grid>
  );
};

export default TaskCardDate;
