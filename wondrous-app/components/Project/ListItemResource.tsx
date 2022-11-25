import Grid from '@mui/material/Grid';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import { randomColors } from 'utils/common';

interface IListItemResource {
  resource;
}

const LeftComponent = ({ name }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <Grid
      container
      width="22px"
      height="22px"
      bgcolor={randomColors}
      borderRadius="4px"
      alignItems="center"
      justifyContent="center"
      padding="0"
    >
      <FolderIcon />
    </Grid>
    {name}
  </Grid>
);

const ListItemResource = (props: IListItemResource) => (
  <ListItemWrapper LeftComponent={LeftComponent} LeftComponentProps={props} />
);

export default ListItemResource;
