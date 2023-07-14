import { Grid } from '@mui/material';
import { BG_TYPES } from 'utils/constants';

const BG_IMAGES = {
  [BG_TYPES.DEFAULT]: '/images/default-bg.png',
  [BG_TYPES.HOME]: '/images/home-bg.png',
  [BG_TYPES.MEMBERS]: '/images/members-bg.png',
  [BG_TYPES.LEVELS]: '/images/levels-bg.png',
  [BG_TYPES.QUESTS]: '/images/quests-bg.png',
  [BG_TYPES.VIEW_QUESTS]: '/images/view-quest-bg.png'
};

const PageWrapper = ({ children, containerProps, bgType = null }) => {
  const img = BG_IMAGES[bgType] || BG_IMAGES[BG_TYPES.DEFAULT];
  return (
    <Grid
      container
      minHeight='100vh'
      {...containerProps}
      sx={{
        backgroundImage: `url(${img})`,
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        ...containerProps?.sx,
      }}
    >
      {children}
    </Grid>
  );
};
export default PageWrapper;
