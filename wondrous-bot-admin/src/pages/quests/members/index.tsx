import { Grid } from '@mui/material';
import PageHeader from 'components/PageHeader';
import TableComponent from 'components/TableComponent';
import { pinkColors } from 'utils/theme/colors';

const MembersPage = () => {
  const data = [
    {
      id: 1,
      name: {
        component: 'label',
        value: 'John Doe',
      },
      level: {
        component: 'hexagon',
        value: 1,
      },
      discord: {
        component: 'discord',
        value: 'JohnDoe#1234',
      },
      twitter: {
        component: 'twitter',
        value: '@JohnDoe',
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
    },
  ];

  const headers = ['Name', 'Level', 'Discord', 'Twitter', 'XP'];
  return (
    <>
      <PageHeader title='Members Directory' withBackButton={false} />
      <Grid
        minHeight='100vh'
        sx={{
          backgroundImage: 'url(/images/members-bg.png)',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
  
        }}
        container
        direction='column'
        gap='42px'
        padding={{
          xs: '14px 14px 120px 14px',
          sm: '24px 56px',
        }}
      >
        <TableComponent data={data} headers={headers} />
      </Grid>
    </>
  );
};

export default MembersPage;
