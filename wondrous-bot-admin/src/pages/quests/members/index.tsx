import { Grid } from '@mui/material';
import PageHeader from 'components/PageHeader';
import TableComponent from 'components/TableComponent';
import { pinkColors } from 'utils/theme/colors';

const MembersPage = () => {
  return (
    <>
      <PageHeader title='Members Directory' withBackButton={false} />
      <Grid
        bgcolor={pinkColors.pink50}
        minHeight='100vh'
        container
        direction='column'
        gap='42px'
        padding={{
          xs: '14px 14px 120px 14px',
          sm: '24px 56px',
        }}
      >
        <TableComponent />
      </Grid>
    </>
  );
};

export default MembersPage;
