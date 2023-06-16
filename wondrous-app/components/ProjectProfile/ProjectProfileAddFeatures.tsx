import { ButtonBase, Grid, Typography } from '@mui/material';
import PlusIcon from 'components/Icons/plus';
import Link from 'next/link';
import palette from 'theme/palette';

const ProjectProfileAddFeatures = ({ orgId, podId, modules }) => {
  const isModulesAllTrue = Object.keys(modules)
    .filter((key) => key !== '__typename')
    .every((key) => modules[key]);
  const href = podId ? `/pod/settings/${podId}/modules` : `/organization/settings/${orgId}/modules`;
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
            {isModulesAllTrue ? 'Configure features' : 'Add features'}
          </Typography>
        </Grid>
      </Link>
    </Grid>
  );
};

export default ProjectProfileAddFeatures;
