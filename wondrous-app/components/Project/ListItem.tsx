import Grid from '@mui/material/Grid';
import { NextRouter, useRouter } from 'next/router';
import palette from 'theme/palette';

interface IEntityItem {
  LeftComponent: React.ElementType;
  RightComponent?: React.ElementType;
  data?: object;
  onClick?: (router: NextRouter, data?) => void;
}

const ListItem = ({ LeftComponent, RightComponent = () => null, onClick, data }: IEntityItem) => {
  const router = useRouter();
  return (
    <Grid
      container
      justifyContent="space-between"
      padding="4px"
      alignItems="center"
      bgcolor="#212121"
      height="36px"
      borderRadius="4px"
      onClick={() => onClick?.(router, data)}
      sx={{
        '&:hover': {
          cursor: 'pointer',
          background: palette.grey920,
        },
      }}
    >
      <Grid container item alignItems="center" width="fit-content">
        <LeftComponent {...data} />
      </Grid>
      <Grid container item alignItems="center" width="fit-content">
        <RightComponent {...data} />
      </Grid>
    </Grid>
  );
};

export default ListItem;
