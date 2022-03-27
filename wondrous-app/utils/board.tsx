import _ from 'lodash';
import { COLUMNS } from '../services/board';
import { TASK_STATUS_ARCHIVED, TASK_STATUS_IN_REVIEW, TASK_STATUS_REQUESTED } from './constants';

export const addProposalItem = (newItem, columns) => {
  columns[0].section.tasks = [newItem, ...columns[0].section.tasks];
  return columns;
};

export const updateProposalItem = (updatedItem, columns) => {
  columns[0].section.tasks = columns[0].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeProposalItem = (itemId, columns) => {
  columns[0].section.tasks = columns[0].section.tasks.filter((task) => task.id !== itemId);

  return columns;
};

export const addTaskItem = (newItem, columns) => {
  columns[0].tasks = [newItem, ...columns[0].tasks];
  return columns;
};

export const updateTaskItem = (updatedItem, columns) => {
  columns[0].tasks = columns[0].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeTaskItem = (itemId, columns) => {
  columns[0].tasks = columns[0].tasks.filter((task) => task.id !== itemId);
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

export const removeInProgressTask = (itemId, columns) => {
  columns[1].tasks = columns[1].tasks.filter((task) => task.id !== itemId);
  return columns;
};

export const addArchiveItem = (newItem, columns) => {
  columns[2].section.tasks = [newItem, ...columns[2].section.tasks];
  return columns;
};

export const updateArchiveItem = (updatedItem, columns) => {
  columns[2].section.tasks = columns[2].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeArchiveItem = (itemId, columns) => {
  columns[2].section.tasks = columns[2].section.tasks.filter((task) => task.id !== itemId);
  return columns;
};

export const addCompletedItem = (newItem, columns) => {
  columns[2].tasks = [newItem, ...columns[2].tasks];
  return columns;
};

export const updateCompletedItem = (updatedItem, columns) => {
  columns[2].tasks = columns[2].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem;
    }
    return task;
  });
  return columns;
};

export const removeCompletedItem = (itemId, columns) => {
  columns[2].tasks = columns[2].tasks.filter((task) => task.id !== itemId);
  return columns;
};

export const updateTask = (updatedTask, columns) => {
  return columns.map((column) => {
    column.section.tasks = column.section.tasks.map((task) => {
      if (task.id === (updatedTask?.taskId ?? updatedTask.id)) {
        return updatedTask;
      }
      return task;
    });
    column.tasks = column.tasks.map((task) => {
      if (task.id === updatedTask.id) {
        return updatedTask;
      }
      return task;
    });
    return column;
  });
};

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
  const newColumns = columns[columnIndex]?.section ? _.cloneDeep(columns) : _.cloneDeep(COLUMNS);
  newColumns[columnIndex].section.tasks = _.cloneDeep(data);
  return newColumns;
};
