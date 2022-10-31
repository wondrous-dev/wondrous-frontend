import { differenceInDays, format, formatDistance } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import { COLUMNS } from 'services/board';
import {
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  STATUS_APPROVED,
  STATUS_OPEN,
  ENTITIES_TYPES,
  STATUS_CLOSED,
} from '../constants';

export const addProposalItem = (newItem, columns) => {
  if (columns[0].section) {
    columns[0].section.tasks = [newItem, ...columns[0].section.tasks];
    return columns;
  }
  columns[0].tasks = [newItem, ...columns[0].tasks];
  return columns;
};

export const updateProposalItem = (updatedItem, columns) => {
  if (columns[0].section) {
    columns[0].section.tasks = columns[0].section.tasks.map((task) => {
      if (task.id === updatedItem.id) {
        return updatedItem;
      }
      return task;
    });
  } else {
    columns[0].tasks = columns[0].tasks.map((task) => {
      if (task.id === updatedItem.id) {
        return updatedItem;
      }
      return task;
    });
  }
  return columns;
};

export const getProposalStatus = (proposal) => {
  let proposalStatus = '';

  if (proposal?.approvedAt) proposalStatus = STATUS_APPROVED;
  if (!proposal?.approvedAt && !proposal?.closedAt) proposalStatus = STATUS_OPEN;
  if (proposal?.closedAt) proposalStatus = STATUS_CLOSED;
  return proposalStatus;
};

export const removeProposalItem = (itemId, columns) => {
  if (columns[0]?.section) {
    columns[0].section.tasks = columns[0].section.tasks.filter((task) => task.id !== itemId);
  } else {
    const allItems = map(columns, 'tasks').flat();
    const item = allItems.find((task) => task.id === itemId);
    if (item) {
      const status = getProposalStatus(item);
      const columnIdx = status ? columns.findIndex((column) => column.status === status) : false;
      if (Number.isInteger(columnIdx)) {
        columns[columnIdx].tasks = columns[columnIdx].tasks.filter((task) => task.id !== itemId);
      }
    }
  }
  return columns;
};

export const addTaskItem = (newItem, columns) => {
  columns[0].tasks = [newItem, ...columns[0].tasks];
  return columns;
};

export const updateTaskItem = (updatedItem, columns) => {
  if (columns[0].tasks) {
    columns[0].tasks = columns[0].tasks.map((task) => {
      if (task.id === updatedItem.id) {
        return updatedItem;
      }
      return task;
    });
  }
  return columns;
};

export const updateTaskItemOnEntityType = (updatedItem, columns) => {
  const columnToUpdate = columns.findIndex((column) => column.id === updatedItem.id);
  columns[columnToUpdate] = updatedItem;
  return columns;
};

export const removeTaskItemOnEntityType = (updatedItem, columns) => {
  const columnToUpdate = columns.filter((column) => column.id !== updatedItem.id);
  return columnToUpdate;
};

export const removeTaskItem = (item, columns) => {
  columns[0].tasks = columns[0].tasks.filter((task) => task.id !== item.id);
  return columns;
};

export const addSubmissionItem = (newItem, columns) => {
  columns[1].section.tasks = [newItem, ...columns[1].section.tasks];
  return columns;
};

export const updateSubmissionItem = (updatedItem, columns) => {
  columns[1].section.tasks = columns[1].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeSubmissionItem = (itemId, columns) => {
  columns[1].section.tasks = columns[1].section.tasks.filter((task) => task.id !== itemId);
  return columns;
};

export const addInProgressTask = (newItem, columns) => {
  columns[1].tasks = [newItem, ...columns[1].tasks];
  return columns;
};

export const updateInProgressTask = (updatedItem, columns) => {
  columns[1].tasks = columns[1].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeInProgressTask = (item, columns) => {
  columns[1].tasks = columns[1].tasks.filter((task) => task.id !== item.id);
  return columns;
};

export const addArchiveItem = (newItem, columns) => {
  columns[3].section.tasks = [newItem, ...columns[3].section.tasks];
  return columns;
};

export const updateArchiveItem = (updatedItem, columns) => {
  columns[3].section.tasks = columns[3].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeArchiveItem = (itemId, columns) => {
  columns[3].section.tasks = columns[3].section.tasks.filter((task) => task.id !== itemId);
  return columns;
};

export const addInReviewItem = (newItem, columns) => {
  columns[2].tasks = [newItem, ...columns[2].tasks];
  return columns;
};

export const updateInReviewItem = (updatedItem, columns) => {
  columns[2].tasks = columns[2].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeInReviewItem = (item, columns) => {
  columns[2].tasks = columns[2].tasks.filter((task) => task.id !== item.id);
  return columns;
};

export const addCompletedItem = (newItem, columns) => {
  columns[3].tasks = [newItem, ...columns[3].tasks];
  return columns;
};

export const updateCompletedItem = (updatedItem, columns) => {
  columns[3].tasks = columns[3].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeCompletedItem = (item, columns) => {
  columns[3].tasks = columns[3].tasks.filter((task) => task.id !== item.id);
  return columns;
};

export const updateTask = (updatedTask, columns) =>
  columns?.map((column) => {
    if (column.section) {
      column.section.tasks = column.section.tasks.map((task) => {
        if (task.id === (updatedTask?.taskId ?? updatedTask.id)) {
          return updatedTask;
        }
        return task;
      });
    }
    if (column?.type === ENTITIES_TYPES.MILESTONE) {
      if (column?.id === updatedTask?.id) {
        return updatedTask;
      }
      return column;
    }
    column.tasks = column.tasks.map((task) => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      return task;
    });
    return column;
  });

export const updateTaskColumns = (tasks, columns) => {
  if (!columns) return [];
  const newColumns = columns.map((column) => {
    column.tasks = column?.tasks.length > 0 ? [...column.tasks] : [];
    return (
      tasks &&
      tasks.reduce((column, task) => {
        if (column.status === task.status) {
          column.tasks = [...column.tasks, task];
        } else if (task?.status === TASK_STATUS_ARCHIVED && column.section?.filter?.taskType === TASK_STATUS_ARCHIVED) {
          column.section.tasks = [...column.section.tasks, task];
        }
        return column;
      }, column)
    );
  });
  return newColumns;
};

export const bindSectionToColumns = ({ columns, data, section }) => {
  const sections = {
    [TASK_STATUS_REQUESTED]: 0,
    [TASK_STATUS_IN_REVIEW]: 1,
  };
  const columnIndex = sections[section];
  const newColumns = columns[columnIndex]?.section ? cloneDeep(columns) : cloneDeep(COLUMNS);
  newColumns[columnIndex].section.tasks = cloneDeep(data);
  return newColumns;
};

export const sectionOpeningReducer = (currentCard, { section, isOpen }) => {
  const taskToSection = [TASK_STATUS_REQUESTED, TASK_STATUS_IN_REVIEW].find(
    (taskType) => taskType === section?.filter?.taskType
  );
  if (taskToSection && taskToSection !== currentCard && isOpen) return taskToSection;
};

export const formatDateDisplay = (date, addTimePreposition = false) => {
  if (!date) return '';

  const taskCreatedBefore = differenceInDays(new Date(), new Date(date));
  const formattedDistance =
    taskCreatedBefore >= 7
      ? format(new Date(date), 'MM/dd/yyyy')
      : formatDistance(new Date(date), new Date(), {
          addSuffix: true,
        });

  const formattedDistanceWithTimePreposition = taskCreatedBefore >= 7 ? `on ${formattedDistance}` : formattedDistance;

  return addTimePreposition ? formattedDistanceWithTimePreposition : formattedDistance;
};

