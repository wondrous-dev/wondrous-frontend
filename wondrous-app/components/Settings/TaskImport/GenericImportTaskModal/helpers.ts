import isEqual from 'lodash/isEqual';
import { ASANA_CSV_HEADERS, TRELLO_CSV_HEADERS } from './constants';

const getFormattedCSVData = (data) => {
  const formattedData = [];

  data.forEach((rowData, idx) => {
    if (idx === 0 || rowData?.length <= 1) return;

    const task = {};
    rowData?.forEach((d, i) => {
      task[data[0][i]?.toLowerCase()?.split(' ')?.join('-')] = d;
    });

    formattedData.push(task);
  });

  return formattedData;
};

const addOrgOrPodIdToTasks = (tasks, isOrg, orgOrPodId) => {
  const newTasks = tasks.map((task) => {
    if (isOrg) {
      task.orgId = orgOrPodId;
    } else {
      task.podId = orgOrPodId;
    }

    return task;
  });

  return newTasks;
};

export const getTasksFromAsanaData = (data, isOrg, orgOrPodId) => {
  if (!isEqual(data[0], ASANA_CSV_HEADERS)) {
    throw new Error('CSV format does not match with Asana');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data.name,
      description: data.notes,
      // due_date: data['due-date'],
      // assignee: data.assignee,
      // tags: data.tags,
      // status: data.status,
      // project: data.project,
      // section: data.section,
    } as any;

    if (data['due-date']) {
      task.dueDate = new Date(data['due-date']);
    }

    return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId);

  return tasks;
};

export const getTasksFromTrelloData = (data, isOrg, orgOrPodId) => {
  if (!isEqual(data[0], TRELLO_CSV_HEADERS)) {
    throw new Error('CSV format does not match with Trello');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data['card-name'],
      description: data['card-description'],
      // due_date: data['due-date'] ? new Date(data['due-date']) : null,
      // assignee: data.assignee,
      // tags: data.tags,
      // status: data.status,
      // project: data.project,
      // section: data.section,
    } as any;

    if (data['due-date']) {
      task.dueDate = new Date(data['due-date']);
    }

    return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId);

  return tasks;
};

export const getTasksFromGenericData = (data, isOrg, orgOrPodId) => {
  console.log('generic');
  console.log({ data });
  return data;
};
