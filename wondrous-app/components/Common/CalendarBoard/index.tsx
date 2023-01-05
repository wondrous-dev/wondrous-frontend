import React, { useMemo } from 'react';

import Calendar from 'components/Calendar';
import { useBoards } from 'utils/hooks';

const CalendarBoard = () => {
  const {
    board: { filters, handleFilterChange, columns },
  } = useBoards();

  if (!handleFilterChange) {
    throw new Error('Please add handleFilterChange function to the [Org|Pod]BoardContext.Provider');
  }

  if (!filters) {
    throw new Error('Please add filters object to the [Org|Pod]BoardContext.Provider');
  }

  // Convert columns into the flat structure
  const tasksMap = useMemo(
    () =>
      columns.reduce((acc, col) => {
        col.tasks.forEach((task) => {
          if (task.dueDate) {
            // key in format yyyy-MM-dd
            const key = task.dueDate.replace(/T.*/g, '');

            acc[key] = acc[key] || [];
            acc[key].push(task);
          }
        });

        return acc;
      }, {}),
    [columns]
  );

  const handleCalendarChange = (fromDate: Date, toDate: Date) => {
    handleFilterChange({
      ...filters,
      fromDate,
      toDate,
    });
  };

  return <Calendar tasksMap={tasksMap} startDate={filters.fromDate} onChange={handleCalendarChange} />;
};

export default CalendarBoard;
