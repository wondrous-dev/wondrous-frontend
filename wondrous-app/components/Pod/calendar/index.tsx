import React, { useEffect, useMemo, useState } from 'react';

import Calendar from 'components/Calendar';
import { useBoards } from 'utils/hooks';
import { CALENDAR_FILTER_SCHEMA } from 'components/organization/calendar/constants';
import CalendarFilters from 'components/organization/calendar/CalendarFilters';
import { ENTITIES_TYPES, TASK_STATUS_TODO } from 'utils/constants';

const CalendarPage = () => {
  const {
    board: { tasks, grants, proposals, filters, handleFilterChange, orgId },
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

  const filterTasks = (tasks, filters) =>
    tasks.reduce((acc, task) => {
      let taskType;
      let taskStatus;

      // TODO: remove this after we have type and status field for all tasks
      if (task.__typename === 'TaskProposalCard') {
        taskType = ENTITIES_TYPES.PROPOSAL;
      } else if (task.__typename === 'GrantCard') {
        taskType = ENTITIES_TYPES.GRANT;
        taskStatus = TASK_STATUS_TODO;
      } else {
        taskType = task.type;
        taskStatus = task.status;
      }

      const isTypeTaskMatch = filters.taskTypes?.length ? filters.taskTypes.includes(taskType) : true;
      // TODO: field status is not in proposals
      const isStatusMatch = filters.statuses?.length && task.status ? filters.statuses.includes(taskStatus) : true;
      const isPodsMatch = filters.podIds?.length ? filters.podIds.includes(task.podId) : true;
      const isPriorityMatch = filters.priorities?.length ? filters.priorities.includes(task.priority) : true;
      const isPrivacyLevelMatch = filters.privacyLevel ? filters.privacyLevel === task.privacyLevel : true;

      if (isTypeTaskMatch && isStatusMatch && isPodsMatch && isPriorityMatch && isPrivacyLevelMatch) {
        acc.push(task);
      }

      return acc;
    }, []);

  useEffect(() => {
    const allTasks = tasks && grants && proposals ? [...tasks, ...grants, ...proposals] : [];
    setTasksOfSelectedTypes(allTasks ? filterTasks(allTasks, filters) : []);
  }, [tasks, filters, grants]);

  const tasksMap = useMemo(
    () =>
      tasksOfSelectedTypes?.reduce((acc, task) => {
        if (task.dueDate) {
          // key in format yyyy-MM-dd
          const key = task.dueDate.replace(/T.*/g, '');
          acc[key] = acc[key] || [];
          acc[key].push(task);
        }

        // TODO: grants do not have a startDate field, so we use the endDate field temporarily
        if (task.__typename === 'GrantCard' && task.endDate) {
          const key = task.endDate.replace(/T.*/g, '');
          acc[key] = acc[key] || [];
          acc[key].push(task);
        }

        // TODO: proposals do not have a dueDate field, so we use the createdAt field temporarily
        if (task.__typename === 'TaskProposalCard' && task.createdAt) {
          const key = task.createdAt.replace(/T.*/g, '');
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
