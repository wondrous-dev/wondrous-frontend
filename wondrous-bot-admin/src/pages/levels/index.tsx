import LevelsReward from 'components/LevelsReward';
import PageHeader from 'components/PageHeader';
import PageWrapper from 'components/Shared/PageWrapper';
import TableComponent from 'components/TableComponent';
import { BG_TYPES } from 'utils/constants';

const LevelsPage = () => {
  const data = [
    {
      id: 1,
      level: {
        component: 'hexagon',
        value: 'index',
      },
      xp: {
        component: 'label',
        value: 10,
        componentProps: {
          fontWeight: 500,
        },
      },
      reward: {
        component: 'custom',
        value: [],
        customComponent: ({value}) => <LevelsReward value={value} onChange={() => {}}/>
      },
    },
  ];
  const headers = ['Level', 'Point Requirement', 'Reward'];
  return (
    <>
      <PageHeader title='' withBackButton={false} />
      <PageWrapper
        bgType={BG_TYPES.LEVELS}
        containerProps={{
          minHeight: '100vh',
          direction: 'column',
          gap: '42px',
          padding: {
            xs: '14px 14px 120px 14px',
            sm: '24px 56px',
          },
        }}
      >
        <TableComponent data={data} headers={headers} />
      </PageWrapper>
    </>
  );
};

export default LevelsPage;
