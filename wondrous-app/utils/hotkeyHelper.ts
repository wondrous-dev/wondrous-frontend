export const HOTKEYS = {
  GLOBAL_SEARCH: 'Meta+k, Meta+p',
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

// TODO: Refactor if needed in future PR
const findNextAvailableStatus = (direction, statusIndex, columns) => {
  let holdStatusIndex = statusIndex;
  for (let i = 0; i <= columns.length; i += 1) {
    if (direction === 'down') {
      holdStatusIndex += 1;
      if (columns.length > holdStatusIndex && columns[holdStatusIndex]?.tasks.length !== 0) {
        return holdStatusIndex;
      }

      if (columns.length === holdStatusIndex) {
        holdStatusIndex = -1;
      }
    }
    if (direction === 'left') {
      holdStatusIndex -= 1;
      if (holdStatusIndex >= 0 && columns[holdStatusIndex]?.tasks.length !== 0) {
        return holdStatusIndex;
      }
      if (holdStatusIndex <= 0) {
        holdStatusIndex = columns.length;
      }
    }
    if (direction === 'right') {
      holdStatusIndex += 1;
      if (columns.length > holdStatusIndex && columns[holdStatusIndex]?.tasks.length !== 0) {
        return holdStatusIndex;
      }
      if (holdStatusIndex === columns.length) {
        holdStatusIndex = -1;
      }
    }
    if (direction === 'up') {
      if (holdStatusIndex === undefined || holdStatusIndex === null) {
        holdStatusIndex = columns.length;
      }
      holdStatusIndex -= 1;
      if (holdStatusIndex >= 0 && columns[holdStatusIndex]?.tasks.length !== 0) {
        return holdStatusIndex;
      }
      if (holdStatusIndex <= 0) {
        holdStatusIndex = columns.length;
      }
    }
  }
};

const findFirstAvailableTask = (columns) => columns.findIndex((column) => column.tasks.length > 0);

export const hotkeyUpArrowHelper = (taskIndex, statusIndex, columns) => {
  let holdTaskIndex = taskIndex;
  let holdStatusIndex = statusIndex;

  if (holdStatusIndex === null && holdTaskIndex === null) {
    holdStatusIndex = findNextAvailableStatus('up', statusIndex, columns);
    holdTaskIndex = columns[holdStatusIndex]?.tasks.length - 1;
    return { holdTaskIndex, holdStatusIndex };
  }
  if (holdTaskIndex - 1 >= 0) {
    holdTaskIndex -= 1;
    return { holdTaskIndex, holdStatusIndex };
  }
  holdStatusIndex = findNextAvailableStatus('up', statusIndex, columns);
  holdTaskIndex = columns[holdStatusIndex]?.tasks.length - 1;
  return { holdTaskIndex, holdStatusIndex };
};

export const hotkeyLeftArrowHelper = (taskIndex, statusIndex, columns) => {
  let holdStatusIndex = statusIndex;
  let holdTaskIndex = taskIndex;
  if (holdStatusIndex !== null) {
    holdStatusIndex = findNextAvailableStatus('left', statusIndex, columns);
    holdTaskIndex = 0;
  } else {
    holdStatusIndex = findFirstAvailableTask(columns);
    holdTaskIndex = 0;
  }
  return { holdTaskIndex, holdStatusIndex };
};

export const hotkeyDownArrowHelper = (taskIndex, statusIndex, columns) => {
  let holdTaskIndex = taskIndex;
  let holdStatusIndex = statusIndex;

  if (holdStatusIndex === null && holdTaskIndex === null) {
    holdStatusIndex = findFirstAvailableTask(columns);
    holdTaskIndex = 0;
    return { holdTaskIndex, holdStatusIndex };
  }
  if (holdTaskIndex + 1 < columns[holdStatusIndex]?.tasks?.length) {
    holdTaskIndex += 1;
    return { holdTaskIndex, holdStatusIndex };
  }
  holdStatusIndex = findNextAvailableStatus('down', statusIndex, columns);
  holdTaskIndex = 0;
  return { holdTaskIndex, holdStatusIndex };
};

export const hotkeyRightArrowHelper = (taskIndex, statusIndex, columns) => {
  let holdStatusIndex = statusIndex;
  let holdTaskIndex = taskIndex;
  if (holdStatusIndex !== null) {
    holdStatusIndex = findNextAvailableStatus('right', statusIndex, columns);
    holdTaskIndex = 0;
  } else {
    holdStatusIndex = findFirstAvailableTask(columns);
    holdTaskIndex = 0;
  }
  return { holdTaskIndex, holdStatusIndex };
};

export const pickHotkeyFunction = (key, taskIndex, statusIndex, columns) => {
  if (key === ARROW_KEYS.ARROW_RIGHT) return hotkeyRightArrowHelper(taskIndex, statusIndex, columns);
  if (key === ARROW_KEYS.ARROW_LEFT) return hotkeyLeftArrowHelper(taskIndex, statusIndex, columns);
  if (key === ARROW_KEYS.ARROW_UP) return hotkeyUpArrowHelper(taskIndex, statusIndex, columns);
  if (key === ARROW_KEYS.ARROW_DOWN) return hotkeyDownArrowHelper(taskIndex, statusIndex, columns);
  return null;
};
