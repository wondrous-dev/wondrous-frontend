import { ButtonBase, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import QuestResultsCard from './QuestResultsCard';
import { FilterPill } from './styles';

const STATS = [
  {
    label: 'Awaiting Approval',
    count: 6,
    value: 'awaiting_approval',
  },
  {
    label: 'Approved',
    value: 'approved',
    count: 0,
  },
  {
    label: 'Rejected',
    count: 0,
    value: 'rejected',
  },
];

const SUBMISSIONS_MOCK = [
  {
    user: 'CubeBrain',
    rewards: [
      {
        value: 69,
        type: 'DeGodz Points',
      },
    ],
    stepsInfo: [
      {
        type: 'text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'Text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      },
      {
        type: 'Quiz',
        value: 'This answer is correct',
      },
    ],
    attachments: [],
  },
  {
    user: 'CubeBrainasd',
    rewards: [
      {
        value: 69,
        type: 'DeGodz Points',
      },
    ],
    stepsInfo: [
      {
        type: 'text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'Text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      },
      {
        type: 'Quiz',
        value: 'This answer is correct',
      },
    ],
    attachments: [],
  },
  {
    user: 'Brawwww',
    rewards: [
      {
        value: 69,
        type: 'DeGodz Points',
      },
    ],
    stepsInfo: [
      {
        type: 'text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
      {
        type: 'Text',
        value:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
      },
      {
        type: 'Quiz',
        value: 'This answer is correct',
      },
    ],
    attachments: [
      {
        type: 'file',
        value: 'https://blabla.com/test?.jpeg',
        title: 'File 1',
      },
      {
        type: 'file',
        value: 'https://blabla.com/test?.jpeg',
        title: 'File 2',
      },
      {
        type: 'file',
        value: 'https://blabla.com/test?.jpeg',
        title: 'File 3',
      },
    ],
  },
];
const QuestResults = ({ submissions = SUBMISSIONS_MOCK, stats = STATS }) => {
  const [filter, setFilter] = useState('awaiting_approval');

  const handleFilterChange = (value) => filter !== value && setFilter(value);
  return (
    <Grid
      display='flex'
      gap='24px'
      flexDirection='column'
      alignItems='flex-start'
      justifyContent='flex-start'
      width='100%'
    >
      <Typography
        fontFamily='Poppins'
        fontWeight={600}
        fontSize='18px'
        lineHeight='24px'
        color='black'
      >
        {submissions?.length || 8} submissions
      </Typography>
      <Grid display='flex' gap='14px' alignItems='center'>
        {stats.map((stat, idx) => (
          <FilterPill
            type='button'
            key={stat.value}
            $isActive={stat.value === filter}
            onClick={() => handleFilterChange(stat.value)}
          >
            {stat.count} {stat.label}
          </FilterPill>
        ))}
      </Grid>
      {submissions?.map((submission, idx) => (
        <QuestResultsCard submission={submission} key={idx}/>
      ))}
    </Grid>
  );
};

export default QuestResults;
