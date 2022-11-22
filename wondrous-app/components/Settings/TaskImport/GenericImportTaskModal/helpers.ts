import isEqual from 'lodash/isEqual';
import { TASK_STATUS_DONE, TASK_STATUS_IN_PROGRESS, TASK_STATUS_IN_REVIEW, TASK_STATUS_TODO } from 'utils/constants';
import {
  ASANA_TASKS_CSV_HEADERS,
  DEWORK_TASKS_CSV_HEADERS,
  GENERIC_TASKS_CSV_HEADERS,
  TRELLO_TASKS_CSV_HEADERS,
} from './constants';

const URL_REGEX = /(https?:\/\/[^\s]+\w)/g;
const BOLD_REGEX = /(\*\*\w*\*\*)/g;
const ITALIC_REGEX = /(\*\w*\*)/g;
const BULLET_LIST_REGEX = /(\s{4}|- )\w+/g;

const regexToMatch = new RegExp([URL_REGEX.source, BOLD_REGEX.source, ITALIC_REGEX.source].join('|'), 'g');

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
    const isParagraphBulletList = paragraph.match(BULLET_LIST_REGEX);

    if (isParagraphBulletList) {
      formattedDescription.push({
        type: 'bulleted-list',
        children: [{ type: 'list-item', children: [{ text: paragraph?.replace('- ', '') }] }],
      });

      return;
    }

    const formattedParagraph = { type: 'paragraph', children: [] };

    const content = paragraph.split(regexToMatch)?.filter((splitContentPart) => !!splitContentPart);

    content?.forEach((splitContent) => {
      if (URL_REGEX.test(splitContent)) {
        formattedParagraph.children.push({
          type: 'link',
          href: splitContent,
          children: [{ text: 'link' }],
        });
      } else if (BOLD_REGEX.test(splitContent)) {
        formattedParagraph.children.push({
          bold: true,
          text: splitContent.replace(/\*/g, ''),
        });
      } else if (ITALIC_REGEX.test(splitContent)) {
        formattedParagraph.children.push({
          italic: true,
          text: splitContent.replace(/\*/g, ''),
        });
      } else {
        formattedParagraph.children.push({ text: splitContent });
      }
    });

    formattedDescription.push(formattedParagraph);
  });

  return JSON.stringify(formattedDescription);
};

const addOrgOrPodIdToTasks = (tasks, isOrg, orgOrPodId, orgId) => {
  const newTasks = tasks.map((task) => {
    if (isOrg) {
      task.orgId = orgOrPodId;
    } else {
      task.orgId = orgId;
      task.podId = orgOrPodId;
    }

    return task;
  });

  return newTasks;
};

export const getTasksFromAsanaData = ({ data, isOrg, orgOrPodId, orgId }) => {
  if (!isEqual(data[0], ASANA_TASKS_CSV_HEADERS)) {
    throw new Error('CSV format does not match with Asana');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data.name,
      description: getFormattedDescription(data.notes),
    } as any;

    if (data['due-date']) {
      task.dueDate = new Date(data['due-date']);
    }

    return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId, orgId);

  return tasks;
};

export const getTasksFromTrelloData = ({ data, isOrg, orgOrPodId, orgId }) => {
  if (!isEqual(data[0], TRELLO_TASKS_CSV_HEADERS)) {
    throw new Error('CSV format does not match with Trello');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data['card-name'],
      description: getFormattedDescription(data['card-description']),
    } as any;

    if (data['due-date']) {
      task.dueDate = new Date(data['due-date']);
    }

    if (data['story-points']) return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId, orgId);

  return tasks;
};

export const getTasksFromDeworkData = ({ data, isOrg, orgOrPodId, orgId }) => {
  if (!isEqual(data[0], DEWORK_TASKS_CSV_HEADERS)) {
    throw new Error('CSV format does not match with Dework');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data.name,
      description: '',
    } as any;

    if (data['due-date']) {
      task.dueDate = new Date(data['due-date']);
    }

    if (data['story-points']) {
      task.points = parseInt(data['story-points']);
    }

    if (data.status) {
      if (data.status === 'TODO') {
        task.status = TASK_STATUS_TODO;
      } else if (data.status === 'IN_PROGRESS') {
        task.status = TASK_STATUS_IN_PROGRESS;
      } else if (data.status === 'IN_REVIEW') {
        task.status = TASK_STATUS_IN_REVIEW;
      } else if (data.status === 'DONE') {
        task.status = TASK_STATUS_DONE;
      }
    }

    return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId, orgId);

  return tasks;
};
export const getTasksFromGenericData = ({ data, isOrg, orgOrPodId, orgId }) => {
  if (!isEqual(data[0], GENERIC_TASKS_CSV_HEADERS)) {
    throw new Error('CSV format does not match with the given format');
  }

  const formattedData = getFormattedCSVData(data);

  let tasks = formattedData.map((data) => {
    const task = {
      title: data.title,
      description: getFormattedDescription(data.description),
    };

    return task;
  });

  tasks = addOrgOrPodIdToTasks(tasks, isOrg, orgOrPodId, orgId);

  return tasks;
};
