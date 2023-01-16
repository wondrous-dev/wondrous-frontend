import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import palette from 'theme/palette';
import { useBoardPermission } from 'utils/hooks';

const CreateButton = dynamic(() => import('./CreateButton'), { ssr: false });

const SectionEmpty = ({ backgroundImageUrl, CreateButtonProps }) => {
  const { hasFullOrEditPermission } = useBoardPermission();
  return (
    <Grid
      container
      width="auto"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      bgcolor={palette.grey950}
      borderRadius="6px"
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      {hasFullOrEditPermission ? <CreateButton {...CreateButtonProps} /> : null}
    </Grid>
  );
};

export default SectionEmpty;
