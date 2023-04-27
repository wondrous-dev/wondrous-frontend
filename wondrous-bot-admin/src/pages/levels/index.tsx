import { useMutation } from '@apollo/client';
import LevelsReward from 'components/LevelsReward';
import PageHeader from 'components/PageHeader';
import PageWrapper from 'components/Shared/PageWrapper';
import TableComponent from 'components/TableComponent';
import { UPDATE_QUEST_LABEL } from 'graphql/mutations';
import { useContext, useMemo, useState } from 'react';
import { BG_TYPES } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';
import { LEVELS_XP } from 'utils/levels';
import useLevels from 'utils/levels/hooks';

const LevelsPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  const [rewards, setRewards] = useState({});

  const [updateQuestLevel] = useMutation(UPDATE_QUEST_LABEL, {
    refetchQueries: ['getOrgQuestsLevels'],
  });

  const updateLevel = (key, value) => {
    return updateQuestLevel({
      variables: {
        orgId: activeOrg?.id,
        level: key,
        name: value,
      },
    });
  };

  const data = useMemo(() => {
    return Object.keys(levels).map((key, idx) => {
      return {
        id: key,
        level: {
          component: 'hexagon',
          value: key,
          label: levels[key],
          labelProps: {
            canEdit: true,
            onEdit: (value) => updateLevel(key, value),
          },
        },
        xp: {
          component: 'label',
          value: LEVELS_XP[key],
          componentProps: {
            fontWeight: 500,
          },
        },
        reward: {
          component: 'custom',
          value: rewards[key] || [],
          customComponent: ({ value }) => (
            <LevelsReward
              value={value}
              onChange={(value) => {
                setRewards({
                  ...rewards,
                  [key]: value,
                });
              }}
            />
          ),
        },
      };
    });
  }, [levels, rewards]);

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
