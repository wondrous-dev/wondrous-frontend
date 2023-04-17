import { Grid } from '@mui/material';
import PageHeader from 'components/PageHeader';
import TableComponent from 'components/TableComponent';
import { pinkColors } from 'utils/theme/colors';

const LevelsPage = () => {
  const data = [
    {
      id: 1,
      level: {
        component: 'hexagon',
        value: 1,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 2,
      level: {
        component: 'hexagon',
        value: 2,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 3,
      level: {
        component: 'hexagon',
        value: 3,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 4,
      level: {
        component: 'hexagon',
        value: 4,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 5,
      level: {
        component: 'hexagon',
        value: 5,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 6,
      level: {
        component: 'hexagon',
        value: 6,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 7,
      level: {
        component: 'hexagon',
        value: 7,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 8,
      level: {
        component: 'hexagon',
        value: 8,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 9,
      level: {
        component: 'hexagon',
        value: 9,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
    {
      id: 10,
      level: {
        component: 'hexagon',
        value: 10,
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'reward',
        value: 'Welcome NFT',
      },
    },
  ];
  const headers = ['Level', 'Point Requirement', 'Reward'];
  return (
    <>
      <PageHeader title='' withBackButton={false} />
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
        <TableComponent data={data} headers={headers} />
      </Grid>
    </>
  );
};

export default LevelsPage;
