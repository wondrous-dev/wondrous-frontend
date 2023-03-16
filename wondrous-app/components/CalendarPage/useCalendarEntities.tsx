import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import format from 'date-fns/format';

import { CalendarProvidedIn, CalendarTaskFilter } from 'components/CalendarPage/types';
import {
  GET_ORG_GRANTS,
  GET_ORG_MILESTONE_BOARD_TASKS,
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_TASKS,
} from 'graphql/queries';
import { TaskInterface } from 'types/task';
import {
  ENTITIES_TYPES,
  GRANTS_STATUSES,
  PRIVACY_LEVEL,
  PROPOSAL_STATUS_LIST,
  STATUS_APPROVED,
  STATUS_CLOSED,
  STATUS_OPEN,
  STATUSES_ON_ENTITY_TYPES,
} from 'utils/constants';

const DATE_FORMAT = 'yyyy-MM-dd';
const APOLLO_QUERIES = {
  organization: {
    TASKS: GET_ORG_TASK_BOARD_TASKS,
    MILESTONES: GET_ORG_MILESTONE_BOARD_TASKS,
    PROPOSALS: GET_ORG_TASK_BOARD_PROPOSALS,
    GRANTS: GET_ORG_GRANTS,
  },
};

type Props = {
  orgId: string;
  providedIn: CalendarProvidedIn;
  filters: CalendarTaskFilter;
};

const useCalendarEntities = ({ filters, orgId, providedIn }: Props) => {
  const queries = APOLLO_QUERIES[providedIn];
  const { fromDate, toDate, types: entityTypes, statuses } = filters;
  const isAllEntitiesSelected = entityTypes.length === 0;

  const [tasksMap, setTasksMap] = useState<{
    [key: string]: TaskInterface[];
  }>({});

  const [getTasks] = useLazyQuery(queries.TASKS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: console.error,
  });

  const [getMilestones] = useLazyQuery(queries.MILESTONES, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: console.error,
  });

  const [getProposals] = useLazyQuery(queries.PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: console.error,
  });

  const [getGrants] = useLazyQuery(queries.GRANTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: console.error,
  });

  const fetchEntities = async () => {
    const entityList = [];
    const variables = {
      ...filters,
      orgId,
      fromDate: format(fromDate, DATE_FORMAT),
      toDate: format(toDate, DATE_FORMAT),
      onlyPublic: filters.privacyLevel === PRIVACY_LEVEL.public,
      types: entityTypes,
    };
    console.log(filters, '--------fetchEntities');

    // Fetch tasks
    if (
      isAllEntitiesSelected ||
      entityTypes.includes(ENTITIES_TYPES.TASK) ||
      entityTypes.includes(ENTITIES_TYPES.BOUNTY)
    ) {
      const { data } = await getTasks({
        variables: {
          ...variables,
          statuses:
            statuses?.length > 0
              ? statuses?.filter((status) => STATUSES_ON_ENTITY_TYPES[ENTITIES_TYPES.TASK].includes(status))
              : // double check in case we add new stuff and have no valid entityType.
                STATUSES_ON_ENTITY_TYPES[ENTITIES_TYPES.TASK] || STATUSES_ON_ENTITY_TYPES.DEFAULT,
        },
      });

      entityList.push(data);
    }

    if (isAllEntitiesSelected || entityTypes.includes(ENTITIES_TYPES.MILESTONE)) {
      const { data } = await getMilestones({
        variables: {
          ...variables,
          statuses: STATUSES_ON_ENTITY_TYPES[ENTITIES_TYPES.MILESTONE],
        },
      });

      entityList.push(data);
    }

    if (isAllEntitiesSelected || entityTypes.includes(ENTITIES_TYPES.PROPOSAL)) {
      const { data } = await getProposals({
        variables: {
          ...variables,
          statuses:
            statuses?.length > 0
              ? statuses?.filter((status) => PROPOSAL_STATUS_LIST.includes(status))
              : [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED],
        },
      });

      entityList.push(data);
    }

    if (isAllEntitiesSelected || entityTypes.includes(ENTITIES_TYPES.GRANT)) {
      const { data } = await getGrants({
        variables: {
          ...variables,
          status: GRANTS_STATUSES.OPEN,
        },
      });

      entityList.push(data);
    }

    const newTasksMap: { [key: string]: TaskInterface[] } = {};
    const addEntity = (date: string, task: TaskInterface) => {
      // key in format yyyy-MM-dd
      const key = date.substring(0, 10);

      newTasksMap[key] = newTasksMap[key] || [];
      newTasksMap[key].push(task);
    };

    entityList.forEach((data) => {
      Object.keys(data).forEach((key) => {
        (data[key] || []).forEach((entity) => {
          if (entity.dueDate) {
            addEntity(entity.dueDate, entity);
          } else if (entity.startDate) {
            // This is for grants
            addEntity(entity.startDate, entity);
            addEntity(entity.endDate, entity);
          }
        });
      });
    });

    setTasksMap(newTasksMap);

    return newTasksMap;
  };

  return { fetchEntities, tasksMap };
};

export default useCalendarEntities;
