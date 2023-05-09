import { Box, Grid, Typography } from '@mui/material';
import EmptyState from 'components/EmptyState';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { EMPTY_STATE_TYPES, QUEST_SUBMISSION_STATUS } from 'utils/constants';
import QuestResultsCard from './QuestResultsCard';
import { FilterPill } from './styles';

const QuestResults = ({
  submissions,
  stats = {},
  filter,
  handleFilterChange,
  fetchMore,
  hasMore,
}) => {
  const { ref, inView, entry } = useInView();

  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView, hasMore, fetchMore]);

  const filters = {
    [QUEST_SUBMISSION_STATUS.IN_REVIEW]: {
      label: 'Awaiting Approval',
      value: stats[QUEST_SUBMISSION_STATUS.IN_REVIEW] || 0,
    },

    [QUEST_SUBMISSION_STATUS.APPROVED]: {
      label: 'Approved',
      value: stats[QUEST_SUBMISSION_STATUS.APPROVED] || 0,
    },
    [QUEST_SUBMISSION_STATUS.REJECTED]: {
      label: 'Rejected',
      value: stats[QUEST_SUBMISSION_STATUS.REJECTED] || 0,
    },
  };

  const totalValue = useMemo(
    () =>
      Object.values(filters).reduce(
        (acc: Number, next) => (acc += next.value),
        0
      ),
    [stats]
  );

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
        {totalValue} submissions
      </Typography>
      <Grid display='flex' gap='14px' alignItems='center'>
        {Object.keys(filters).map((key, idx) => (
          <FilterPill
            type='button'
            key={key}
            $isActive={key === filter}
            onClick={() => handleFilterChange(key)}
          >
            {filters[key].value} {filters[key].label}
          </FilterPill>
        ))}
      </Grid>
      <Box ref={ref} width='100%' gap="14px" display="flex" alignItems="center" flexDirection="column">
        {submissions?.length ? (
          submissions?.map((submission, idx) => (
            <QuestResultsCard submission={submission} key={idx} />
          ))
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.SUBMISSIONS} />
        )}
      </Box>
    </Grid>
  );
};

export default QuestResults;
