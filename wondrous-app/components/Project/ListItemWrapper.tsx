import Grid from '@mui/material/Grid';

interface IEntityItem {
  LeftComponent: React.ElementType;
  LeftComponentProps?: object;
  RightComponent: React.ElementType;
  RightComponentProps?: object;
}

const ListItemWrapper = ({ LeftComponent, LeftComponentProps, RightComponent, RightComponentProps }: IEntityItem) => (
  <Grid
    container
    justifyContent="space-between"
    padding="4px"
    alignItems="center"
    bgcolor="#212121"
    height="36px"
    borderRadius="4px"
  >
    <Grid container item alignItems="center" width="fit-content">
      <LeftComponent {...LeftComponentProps} />
    </Grid>
    <Grid container item alignItems="center" width="fit-content">
      <RightComponent {...RightComponentProps} />
    </Grid>
  </Grid>
);

export default ListItemWrapper;
