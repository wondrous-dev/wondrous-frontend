import React, { useEffect, useMemo, useState } from 'react';

import Calendar from 'components/Calendar';
import { useBoards } from 'utils/hooks';
import { CALENDAR_FILTER_SCHEMA } from 'components/organization/calendar/constants';
import CalendarFilters from 'components/organization/calendar/CalendarFilters';

const CalendarPage = () => {
  const {
    board: { tasks, filters, handleFilterChange, orgId },
  } = useBoards();

  const [tasksOfSelectedTypes, setTasksOfSelectedTypes] = useState([]);

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

  const calendarFilterSchema = CALENDAR_FILTER_SCHEMA({ orgId });
  const filterSchema = calendarFilterSchema.filters;

  useEffect(() => {
    if (tasksOfSelectedTypes.length > 0) {
      setTasksOfSelectedTypes([]);
    }

    filters.taskTypes.some((type) => {
      tasks
        ? tasks.map((task) => {
            if (task.type === type) {
              setTasksOfSelectedTypes((currentState) => [...currentState, task]);
            }
          })
        : null;
    });
  }, [tasks, filters.taskTypes]);

  const tasksMap = useMemo(
    () =>
      tasksOfSelectedTypes?.reduce((acc, task) => {
        if (task.dueDate) {
          // key in format yyyy-MM-dd
          const key = task.dueDate.replace(/T.*/g, '');
          acc[key] = acc[key] || [];
          acc[key].push(task);
        }

        return acc;
      }, {}),
    [tasksOfSelectedTypes]
  );

  const handleCalendarChange = (fromDate: Date, toDate: Date) => {
    handleFilterChange({
      ...filters,
      fromDate,
      toDate,
    });
  };

  return (
    <>
      <CalendarFilters filterSchema={filterSchema} onChange={handleFilterChange} showAppliedFilters />
      <Calendar tasksMap={tasksMap} startDate={filters.fromDate} onChange={handleCalendarChange} />
    </>
  );
};

export default CalendarPage;
