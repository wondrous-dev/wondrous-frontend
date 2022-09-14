export const HOTKEYS = {
  GLOBAL_SEARCH: 'shift+enter',
  LOCAL_SEARCH: 'enter',
  SHOW_SHORTCUTS: 'shift+S',
  CREATE_TASK: 'shift+T',
  CREATE_BOUNTY: 'shift+B',
  CREATE_MILESTONE: 'shift+M',
  CREATE_PROPOSAL: 'shift+P',
  CREATE_POD: 'shift+L',
  CREATE_COMMENT: 'W',
  OPEN_FILTER: 'A',
  OPEN_PROFILE: 'P',
  OPEN_EXPLORE: 'E',
  OPEN_DASHBOARD: 'D',
  OPEN_NOTIFICATION: 'N',
  OPEN_PODS: 'L',
  OPEN_MISSION_CONTROL: 'M',
  CHOOSE_ENTITY: 'C',
  LIST_VIEW: ',',
  GRID_VIEW: '.',
  CALENDAR_VIEW: '/',
  ENTER_TASK: 'enter',
  CLAIM_TASK: 'shift+C',
  ALL_KEYS: '*',
};

export const ARROW_KEYS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
};

export const TASK_CONTROLS = Object.values(ARROW_KEYS);
export const TASK_ROUTES_FOR_ROUTER = ['/dashboard', '/dashboard?view=list', '/dashboard?view=grid'];

export const getFirstTask = (columns) => columns[columns.findIndex((column) => column.tasks.length > 0)].tasks[0];

const getTaskInfo = (taskId, columns) => {
  let currentTaskIndex;

  const currentColumnIndex = columns.findIndex((column) => {
    currentTaskIndex = column.tasks.findIndex((columnTask) => columnTask.id === taskId);
    if (currentTaskIndex !== -1) {
      return true;
    }
    return false;
  });
  return { currentColumnIndex, currentTaskIndex };
};

const getNextAvalaibleColumnRight = (columns, currentColumnIndex) => {
  if (columns.length === currentColumnIndex + 1) {
    return columns.findIndex((column) => column.tasks.length > 0);
  }

  const nextColumn = columns.findIndex((column, index) => index > currentColumnIndex && column.tasks.length > 0);

  if (nextColumn === -1) {
    return columns.findIndex((column) => column.tasks.length > 0);
  }

  return nextColumn;
};

const getNextAvalaibleColumnLeft = (columns, currentColumnIndex) => {
  const reversedColumns = [...columns].reverse();
  const reversedindex = columns.length - currentColumnIndex - 1;

  if (currentColumnIndex === 0) {
    const columnFounded = reversedColumns.findIndex((column) => column.tasks.length > 0);
    return columns.length - columnFounded - 1;
  }

  const nextColumn = reversedColumns.findIndex((column, index) => index > reversedindex && column.tasks.length > 0);
  if (nextColumn === -1) {
    return reversedColumns.findIndex((column) => column.tasks.length > 0);
  }

  return columns.length - nextColumn - 1;
};

const downArrowHelper = (taskInfo, columns) => {
  const currentColumn = columns[taskInfo.currentColumnIndex].tasks;

  if (currentColumn.length > taskInfo.currentTaskIndex + 1) {
    return currentColumn[taskInfo.currentTaskIndex + 1].id;
  }
  if (currentColumn.length === taskInfo.currentTaskIndex + 1) {
    const nextColumn = getNextAvalaibleColumnRight(columns, taskInfo.currentColumnIndex);
    return columns[nextColumn].tasks[0].id;
  }
  return undefined;
};

const upArrowHelper = (taskInfo, columns) => {
  const currentColumn = columns[taskInfo.currentColumnIndex].tasks;

  if (taskInfo.currentTaskIndex === 0) {
    const nextColumn = getNextAvalaibleColumnLeft(columns, taskInfo.currentColumnIndex);
    return columns[nextColumn].tasks[columns[nextColumn].tasks.length - 1].id;
  }

  if (currentColumn.length >= taskInfo.currentTaskIndex) {
    return currentColumn[taskInfo.currentTaskIndex - 1].id;
  }

  return undefined;
};

const rightArrowHelper = (taskInfo, columns) => {
  const nextColumn = getNextAvalaibleColumnRight(columns, taskInfo.currentColumnIndex);
  return columns[nextColumn].tasks[0].id;
};

const leftArrowHelper = (taskInfo, columns) => {
  const nextColumn = getNextAvalaibleColumnLeft(columns, taskInfo.currentColumnIndex);
  return columns[nextColumn].tasks[0].id;
};

export const pickHotkeyFunction = (key, columns, taskId): string => {
  const taskInfo = getTaskInfo(taskId, columns);

  if (key === ARROW_KEYS.ARROW_RIGHT) return rightArrowHelper(taskInfo, columns);
  if (key === ARROW_KEYS.ARROW_LEFT) return leftArrowHelper(taskInfo, columns);
  if (key === ARROW_KEYS.ARROW_UP) return upArrowHelper(taskInfo, columns);
  if (key === ARROW_KEYS.ARROW_DOWN) return downArrowHelper(taskInfo, columns);
};
