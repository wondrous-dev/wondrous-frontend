import Grid from '@mui/material/Grid';
import palette from 'theme/palette';

interface IEntityItem {
  LeftComponent: React.ElementType;
  RightComponent?: React.ElementType;
  data?: object;
}

const ListItem = ({ LeftComponent, data, RightComponent = () => null }: IEntityItem) => (
  <Grid
    container
    justifyContent="space-between"
    padding="4px"
    alignItems="center"
    bgcolor="#212121"
    height="36px"
    borderRadius="4px"
    sx={{
      cursor: 'pointer',
      '&:hover': {
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

export default ListItem;
