import Grid from '@mui/material/Grid';
import Compensation from 'components/Common/Compensation';
import CalendarIcon from 'components/Icons/calendar';
import PlantIcon from 'components/Icons/plant.svg';
import palette from 'theme/palette';
import { formatDateDisplay } from 'utils/board';

import { useCreateGrantButtonProps, useGetGrantOrgBoard } from './helpers';
import SectionContent from './SectionContent';

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ numOfGrant, endDate, reward }) => {
  const days = endDate ? formatDateDisplay(new Date(endDate), false, false) : null;
  return (
    <Grid container item alignItems="center" height="28px" gap="12px">
      {days ? (
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
          {days}
        </Grid>
      ) : null}
      <Grid
        container
        item
        height="100%"
        width="fit-content"
        borderRadius="100px"
        sx={{ outline: `1px solid ${palette.grey78}` }}
      >
        <Compensation
          rewards={[reward]}
          pillStyle={{ backgroundColor: palette.grey78, borderRadius: '100px 0 0 100px', height: '100%' }}
        />
        <Grid
          item
          container
          bgcolor={palette.grey87}
          width="fit-content"
          height="100%"
          borderRadius="0 100px 100px 0"
          alignItems="center"
          padding="6px 8px 6px 6px"
          color={palette.white}
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

const ProfileGrantSection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Grants',
      IconComponent: PlantIcon,
    }}
    CreateButtonProps={useCreateGrantButtonProps()}
    backgroundImageUrl="/images/project/grant-empty-bg.svg"
    showAllUrl="grants"
    ListItemProps={{
      LeftComponent,
      RightComponent,
      onClick: ({ router, data: { id }, entityLink }) => router.push(`${entityLink}/grants?grant=${id}`),
    }}
    data={useGetGrantOrgBoard()}
  />
);

export default ProfileGrantSection;
