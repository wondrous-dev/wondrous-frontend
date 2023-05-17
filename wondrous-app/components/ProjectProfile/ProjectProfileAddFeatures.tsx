import { ButtonBase, Grid, Typography } from '@mui/material';
import PlusIcon from 'components/Icons/plus';
import Link from 'next/link';
import palette from 'theme/palette';

const ProjectProfileAddFeatures = ({ orgId, podId }) => {
  const href = orgId ? `/organization/settings/${orgId}/modules` : `/pod/settings/${podId}/modules`;
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="390px"
      minWidth="238px"
      bgcolor={palette.grey900}
      borderRadius="6px"
      width="100%"
    >
      <Link href={href} style={{ textDecoration: 'none' }}>
        <Grid container flexDirection="column" justifyContent="center" alignItems="center" gap="14px">
          <ButtonBase
            disableRipple
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              bgcolor: palette.grey920,
              '&:hover': {
                cursor: 'pointer',
                background: palette.grey88,
              },
            }}
          >
            <PlusIcon width="12px" height="12px" />
          </ButtonBase>
          <Typography color={palette.grey250} fontSize="14px" fontWeight="600">
            Add features
          </Typography>
        </Grid>
      </Link>
    </Grid>
  );
};

export default ProjectProfileAddFeatures;
