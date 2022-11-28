import Grid from '@mui/material/Grid';
import Compensation from 'components/Common/Compensation';
import CalendarIcon from 'components/Icons/calendar';
import PlantIcon from 'components/Icons/plant.svg';
import palette from 'theme/palette';
import { formatDateDisplay } from 'utils/board';

import { useCreateGrantButtonProps, useGetGrantOrgBoard } from './helpers';

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ numOfGrant, endDate, reward }) => {
  const days = formatDateDisplay(new Date(endDate), false, false);
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
        {days}
      </Grid>
      <Grid container item height="100%" width="fit-content" borderRadius="100px" sx={{ outline: '1px solid #474747' }}>
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

const ListItemGrant = { LeftComponent, RightComponent };

const useListGrant = () => ({
  HeaderTitleProps: {
    text: 'Grant',
    IconComponent: PlantIcon,
  },
  CreateButtonProps: useCreateGrantButtonProps(),
  backgroundImageUrl: '/images/project/grant-empty-bg.svg',
  showAllUrl: 'grants',
  ListItemComponents: ListItemGrant,
  data: useGetGrantOrgBoard(),
});

export default useListGrant;
