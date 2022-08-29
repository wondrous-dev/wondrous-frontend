// put in to rerun vercel upload
const findNextAvailableStatus = (direction, statusIndex, columns) => {
  let holdStatusIndex = statusIndex;
  let notFound = true;
  let counter = 0;
  while (notFound) {
    if (direction === 'down') {
      holdStatusIndex += 1;
      if (columns.length > holdStatusIndex && columns[holdStatusIndex]?.tasks.length !== 0) {
        notFound = false;
        return holdStatusIndex;
      }

      if (columns.length === holdStatusIndex) {
        holdStatusIndex = -1;
      }
    }
    if (direction === 'left') {
      holdStatusIndex -= 1;
      if (holdStatusIndex >= 0 && columns[holdStatusIndex]?.tasks.length !== 0) {
        notFound = false;
        return holdStatusIndex;
      }
      if (holdStatusIndex <= 0) {
        holdStatusIndex = columns.length;
      }
    }
    if (direction === 'right') {
      holdStatusIndex += 1;
      if (columns.length > holdStatusIndex && columns[holdStatusIndex]?.tasks.length !== 0) {
        notFound = false;
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
        notFound = false;
        return holdStatusIndex;
      }
      if (holdStatusIndex <= 0) {
        holdStatusIndex = columns.length;
      }
    }
    if (counter === 5) {
      return null;
    }
    counter += 1;
  }
};

const findFirstAvailableTask = (columns) => {
  for (let statuses = 0; statuses < columns.length; statuses += 1) {
    if (columns[statuses]?.tasks.length > 0) {
      return statuses;
    }
  }
  return null;
};

export const hotkeyUpArrowHelper = (taskIndex, statusIndex, columns) => {
  let holdTaskIndex = taskIndex;
  let holdStatusIndex = statusIndex;
  if (holdStatusIndex !== null && holdTaskIndex !== null) {
    if (holdTaskIndex - 1 >= 0) {
      holdTaskIndex -= 1;
      return { holdTaskIndex, holdStatusIndex };
    }
    holdStatusIndex = findNextAvailableStatus('up', statusIndex, columns);
    holdTaskIndex = columns[holdStatusIndex]?.tasks.length - 1;
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
  if (holdStatusIndex !== null && holdTaskIndex !== null) {
    if (columns?.[holdStatusIndex]?.tasks?.length === 0) {
      if (columns.length > holdStatusIndex - 1) {
        holdStatusIndex = findNextAvailableStatus('down', statusIndex, columns);
        holdTaskIndex = 0;
        return { holdTaskIndex, holdStatusIndex };
      }
    } else if (columns.length === holdStatusIndex + 1 && columns[holdStatusIndex]?.tasks.length === holdTaskIndex + 1) {
      holdTaskIndex = -1;
      holdStatusIndex = 0;
      return { holdTaskIndex, holdStatusIndex };
    } else if (columns?.[holdStatusIndex]?.tasks?.length > holdTaskIndex + 1) {
      holdTaskIndex += 1;
      return { holdTaskIndex, holdStatusIndex };
    } else if (columns.length > holdStatusIndex && columns?.[holdStatusIndex]?.tasks.length === holdTaskIndex + 1) {
      if (columns.length > holdStatusIndex - 1) {
        holdStatusIndex = findNextAvailableStatus('down', statusIndex, columns);
        holdTaskIndex = 0;
        return { holdTaskIndex, holdStatusIndex };
      }
    } else {
      holdTaskIndex = -1;
      holdStatusIndex = 0;
      return { holdTaskIndex, holdStatusIndex };
    }
  } else {
    holdStatusIndex = findFirstAvailableTask(columns);
    holdTaskIndex = 0;
    return { holdTaskIndex, holdStatusIndex };
  }
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
