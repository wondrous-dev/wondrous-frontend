import AsanaIcon from 'components/Icons/asana.svg';
import TrelloIcon from 'components/Icons/trello.svg';
import CSVIcon from 'components/Icons/csv.svg';
import { AttachFileIcon } from './styles';

export const DEFAULT_IMPORT_FORMAT = { label: 'Select Import Format', value: '', icon: <AttachFileIcon /> };
export const DEFAULT_TASKS_DATA = { tasks: [], key: Date.now() };

export const IMPORT_FORMAT_OPTIONS = [
  { label: 'Asana', value: 'asana', icon: <AsanaIcon /> },
  { label: 'Trello', value: 'trello', icon: <TrelloIcon /> },
  { label: 'General', value: 'general', icon: <CSVIcon /> },
];

export const IMPORT_FORMATS = {
  ASANA: 'asana',
  TRELLO: 'trello',
  GENERAL: 'general',
};

export const ASANA_TASKS_CSV_HEADERS = [
  'Task ID',
  'Created At',
  'Completed At',
  'Last Modified',
  'Name',
  'Section/Column',
  'Assignee',
  'Assignee Email',
  'Start Date',
  'Due Date',
  'Tags',
  'Notes',
  'Projects',
  'Parent Task',
  'Blocked By (Dependencies)',
  'Blocking (Dependencies)',
  'Priority',
  'Status',
];

export const TRELLO_TASKS_CSV_HEADERS = [
  'Card ID',
  'Card Name',
  'Card URL',
  'Card Description',
  'Labels',
  'Members',
  'Due Date',
  'Attachment Count',
  'Attachment Links',
  'Checklist Item Total Count',
  'Checklist Item Completed Count',
  'Vote Count',
  'Comment Count',
  'Last Activity Date',
  'List ID',
  'List Name',
  'Board ID',
  'Board Name',
  'Archived',
  'Start Date',
  'Due Complete',
];

export const GENERIC_TASKS_CSV_HEADERS = ['Title', 'Description'];
