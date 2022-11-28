import Grid from '@mui/material/Grid';
import Compensation from 'components/Common/Compensation';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';

interface IListItemBounty {
  bounty;
}

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ rewards }) => <Compensation rewards={rewards} />;

const ListItemBounty = (props: IListItemBounty) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemBounty;
