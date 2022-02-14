export const addSearchParamsUrl = (url: string, param: string, paramValue: string) => {
  const newUrl = new URL(url);
  const searchParams = new URLSearchParams(newUrl.searchParams);
  searchParams.set(param, paramValue);
  return newUrl.pathname + '?' + searchParams.toString();
};

export const generateRandomString = function (length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export function createSpacingUnit(multiplier = 1) {
  return function spacingUnit({ theme }) {
    return theme.spacing(multiplier);
  };
}

export const delQuery = (asPath) => {
  return asPath.split('?')[0];
};

export const dedupeColumns = (columns) => {
  const taskMap = {};
  if (!columns) return [];
  const newColumns = columns.map((column) => {
    column.tasks = column.tasks.filter((task) => {
      if (!(task?.id in taskMap)) {
        taskMap[task?.id] = true;
        return true;
      }
      return false;
    });
    return column;
  });
  return newColumns;
};
