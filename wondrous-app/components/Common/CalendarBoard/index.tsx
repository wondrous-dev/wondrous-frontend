import React, {useMemo} from 'react';

import Calendar from 'components/Calendar';
import { useBoards } from 'utils/hooks';

const CalendarBoard = () => {
  const { board: { filters, handleFilterChange, columns } } = useBoards();

  // Convert columns into the flat structure
  const tasksMap = useMemo(() => {
    return columns.reduce((acc, col) => {
      col.tasks.forEach((task) => {
        if (task.dueDate) {
          const key = task.dueDate.replace(/T.*/g, '');

          acc[key] = acc[key] || [];
          acc[key].push(task);
        }
      });

      return acc;
    }, {});
  }, [columns]);

  const handleCalendarChange = (fromDate: Date, toDate: Date) => {
    handleFilterChange({
      ...filters,
      fromDate,
      toDate,
    });
  };

  return (
    <Calendar
      tasksMap={tasksMap}
      startDate={filters.fromDate}
      endDate={filters.toDate}
      onChange={handleCalendarChange}
    />
  );
};

export default CalendarBoard;
