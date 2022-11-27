import Grid from '@mui/material/Grid';
import Compensation from 'components/Common/Compensation';
import CalendarIcon from 'components/Icons/calendar';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import intervalToDuration from 'date-fns/intervalToDuration';
import palette from 'theme/palette';

interface IListIemGrant {
  task;
}

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ numOfGrant, endDate, reward }) => {
  const { days } = intervalToDuration({
    start: new Date(),
    end: endDate,
  });
  return (
    <Grid container item alignItems="center" height="28px" gap="12px">
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
        {days}d
      </Grid>
      <Grid container item height="100%" width="fit-content" borderRadius="100px" border="1px solid #474747">
        <Compensation
          rewards={[reward]}
          pillStyle={{ backgroundColor: '#474747', borderRadius: '100px 0 0 100px', height: '100%' }}
        />
        <Grid
          item
          container
          bgcolor="#313131"
          width="fit-content"
          height="100%"
          borderRadius="0 100px 100px 0"
          alignItems="center"
          padding="6px 8px 6px 6px"
          color="#fff"
          fontSize="13px"
          fontWeight="500"
          lineHeight="0"
        >
          x{numOfGrant}
        </Grid>
      </Grid>
    </Grid>
  );
};

const ListItemGrant = (props: IListIemGrant) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemGrant;
