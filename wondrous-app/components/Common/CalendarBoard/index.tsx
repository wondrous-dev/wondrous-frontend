import React, { useMemo } from 'react';

import Calendar from 'components/Calendar';
import { useBoards } from 'utils/hooks';

const CalendarBoard = () => {
  const {
    board: { filters, handleFilterChange, columns: columnsOrTasks },
  } = useBoards();

  if (!handleFilterChange) {
    throw new Error('Please add handleFilterChange function to the [Org|Pod]BoardContext.Provider');
  }

  if (!filters) {
    throw new Error('Please add filters object to the [Org|Pod]BoardContext.Provider');
  }

  if (!filters.fromDate || !filters.toDate) {
    throw new Error(
      `Please add fromDate and toDate fields to the filters object. Current filters are: ${JSON.stringify(filters)}`
    );
  }

  // Convert columns into the flat structure
  const tasksMap = useMemo(() => {
    // Milestones returns array, not map with columns
    if (!columnsOrTasks[0]?.tasks) {
      return columnsOrTasks.reduce((acc, task) => {
        if (task.dueDate) {
          // key in format yyyy-MM-dd
          const key = task.dueDate.replace(/T.*/g, '');

          acc[key] = acc[key] || [];
          acc[key].push(task);
        }

        return acc;
      }, {});
    }

    return columnsOrTasks.reduce((acc, col) => {
      col.tasks.forEach((task) => {
        if (task.dueDate) {
          // key in format yyyy-MM-dd
          const key = task.dueDate.replace(/T.*/g, '');

          acc[key] = acc[key] || [];
          acc[key].push(task);
        }
      });

      return acc;
    }, {});
  }, [columnsOrTasks]);

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
