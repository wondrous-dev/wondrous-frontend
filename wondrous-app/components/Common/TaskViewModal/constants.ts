export const tabs = {
  submissions: 'Submissions',
  subTasks: 'Subtasks',
  discussion: 'Discussion',
  tasks: 'Tasks',
  applications: 'Applications',
};

export const tabsPerType = {
  proposalTabs: [tabs.discussion],
  milestoneTabs: [tabs.tasks, tabs.discussion],
  subtaskTabs: [tabs.submissions, tabs.discussion],
  bountyTabs: [tabs.submissions, tabs.discussion],
  taskTabs: [tabs.applications, tabs.submissions, tabs.subTasks, tabs.discussion],
  grantTabs: [tabs.applications, tabs.discussion],
  grantApplicationTabs: [tabs.discussion],
};
