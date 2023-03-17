import endOfMonth from 'date-fns/endOfMonth';
import React, { useEffect, useMemo, useState } from 'react';
import startOfMonth from 'date-fns/startOfMonth';

import Calendar from 'components/Calendar';
import CalendarFilters from 'components/CalendarPage/CalendarFilters';
import TaskViewModalWatcher from 'components/Common/TaskViewModal/TaskViewModalWatcher';
import useCalendarEntities from 'components/CalendarPage/useCalendarEntities';
import { getFilterSchema } from 'components/CalendarPage/constants';
import { CalendarProvidedIn, CalendarTaskFilter } from 'components/CalendarPage/types';

type Props = {
  orgId: string;
  providedIn: CalendarProvidedIn;
  podId?: string;
};

const CalendarPage: React.FC<Props> = ({ orgId, providedIn, podId }) => {
  const [filters, setFilters] = useState<CalendarTaskFilter>({
    date: null,
    fromDate: startOfMonth(new Date()),
    labelId: null,
    limit: 1000,
    offset: 0,
    podIds: [],
    priorities: [],
    privacyLevel: null,
    statuses: [],
    toDate: endOfMonth(new Date()),
    types: [],
  });

  const filterSchema = useMemo(() => getFilterSchema({ orgId, podId }), [orgId, podId]);
  const { tasksMap } = useCalendarEntities({ orgId, podId, filters, providedIn });

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
