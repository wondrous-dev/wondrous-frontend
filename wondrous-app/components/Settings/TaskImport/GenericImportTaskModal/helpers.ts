import isEqual from 'lodash/isEqual';
import { ASANA_CSV_HEADERS, TRELLO_CSV_HEADERS } from './constants';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

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

const getFormattedDescription = (description: string) => {
  const formattedDescription = [];
  const paragraphs = description?.split('\n');
  paragraphs?.forEach((paragraph) => {
    const formattedParagraph = { type: 'paragraph', children: [] };
    const content = paragraph.split(URL_REGEX)?.filter((c) => !!c);
    content?.forEach((c) => {
      if (c?.match(URL_REGEX)) {
        formattedParagraph.children.push({ type: 'link', href: c, children: [{ text: c }] });
      } else {
        formattedParagraph.children.push({ text: c });
      }
    });
    formattedDescription.push(formattedParagraph);
  });
  return JSON.stringify(formattedDescription);
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
      description: getFormattedDescription(data.notes),
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
      description: getFormattedDescription(data['card-description']),
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
