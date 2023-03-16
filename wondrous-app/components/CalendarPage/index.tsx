import endOfMonth from 'date-fns/endOfMonth';
import React, { useEffect, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';

import Calendar from 'components/Calendar';
import CalendarFilters from 'components/CalendarPage/CalendarFilters';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import useCalendarEntities from 'components/CalendarPage/useCalendarEntities';
import { CALENDAR_FILTER_SCHEMA } from 'components/CalendarPage/constants';
import { CalendarProvidedIn, CalendarTaskFilter } from 'components/CalendarPage/types';

type Props = {
  orgId: string;
  providedIn: CalendarProvidedIn;
};

const CalendarPage: React.FC<Props> = ({ orgId, providedIn }) => {
  const [filters, setFilters] = useState<CalendarTaskFilter>({
    date: null,
    fromDate: startOfMonth(new Date()),
    labelId: null,
    podIds: [],
    privacyLevel: null,
    priorities: [],
    statuses: [],
    toDate: endOfMonth(new Date()),
    types: [],
    limit: 1000,
    offset: 0,
  });

  const calendarFilterSchema = CALENDAR_FILTER_SCHEMA({ orgId });
  const filterSchema = calendarFilterSchema.filters;
  const { fetchEntities, tasksMap } = useCalendarEntities({ orgId, filters, providedIn });

  useEffect(() => {
    if (!orgId) {
      return;
    }

    fetchEntities();
  }, [filters, orgId]);

  const handleFilterChange = (filtersToApply) => {
    setFilters({
      ...filtersToApply,
      types: filtersToApply.types ?? filters.types,
      fromDate: filtersToApply.fromDate ?? filters.fromDate,
      toDate: filtersToApply.toDate ?? filters.toDate,
    });
  };

  const handleCalendarChange = (fromDate: Date, toDate: Date) => {
    handleFilterChange({
      ...filters,
      fromDate,
      toDate,
    });
  };

  return (
    <>
      <TaskViewModalWatcher />
      <CalendarFilters filters={filters} filterSchema={filterSchema} onChange={handleFilterChange} showAppliedFilters />
      <Calendar tasksMap={tasksMap} startDate={filters.fromDate} onChange={handleCalendarChange} />
    </>
  );
};

export default CalendarPage;
