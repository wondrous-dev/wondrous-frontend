import { useMutation, useQuery } from '@apollo/client';
import LevelsReward from 'components/LevelsReward';
import PageHeader from 'components/PageHeader';
import PageWrapper from 'components/Shared/PageWrapper';
import TableComponent from 'components/TableComponent';
import { UPDATE_QUEST_LABEL } from 'graphql/mutations';
import { GET_ORG_LEVEL_REWARDS } from 'graphql/queries';
import { useContext, useMemo, useState } from 'react';
import { BG_TYPES } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';
import { useDiscordRoles } from 'utils/discord';
import { LEVELS_XP } from 'utils/levels';
import useLevels from 'utils/levels/hooks';

const LevelsPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });

  //TODO we probably don't need this state. We can just use the data from the query, change later
  const [rewards, setRewards] = useState({});

  const { data: rewardsData } = useQuery(GET_ORG_LEVEL_REWARDS, {
    variables: {
      orgId: activeOrg?.id,
    },
    onCompleted: ({ getOrgLevelsRewards }) => {
      const newRewards = getOrgLevelsRewards.reduce((acc, curr) => {
        acc[curr.level] = curr.discordRewardData;
        return acc;
      }, {});
      setRewards(newRewards);
    },
  });

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

  const roles = useDiscordRoles({
    orgId: activeOrg?.id,
  });

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
          value: rewards[key] || {},
          customComponent: ({ value }) => (
            <LevelsReward
              value={value}
              roles={roles}
              level={key}
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
