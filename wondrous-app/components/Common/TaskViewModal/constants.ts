export const tabs = {
  submissions: 'Submissions',
  subTasks: 'Subtasks',
  discussion: 'Discussion',
  tasks: 'Tasks',
  applications: 'Applications',
  activeApplications: 'Active',
};

export const tabsPerType = {
  proposalTabs: [tabs.discussion],
  milestoneTabs: [tabs.tasks, tabs.discussion],
  subtaskTabs: [tabs.submissions, tabs.discussion],
  bountyTabs: [tabs.submissions, tabs.discussion],
  taskTabs: [tabs.submissions, tabs.subTasks, tabs.discussion, tabs.applications],
  grantTabs: [tabs.applications, tabs.discussion],
  grantApplicationTabs: [tabs.discussion],
};
