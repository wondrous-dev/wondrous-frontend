import { tabsPerType } from './constants';

export const selectTabsPerType = (isTaskProposal, isMilestone, isSubtask, isBounty) => {
  if (isTaskProposal) return tabsPerType.proposalTabs;
  if (isMilestone) return tabsPerType.milestoneTabs;
  if (isSubtask) return tabsPerType.subtaskTabs;
  if (isBounty) return tabsPerType.bountyTabs;
  return tabsPerType.taskTabs;
};

export const openSnapshot = async (orgSnapshot, fetchedTask, isTest) => {
  try {
    const space = orgSnapshot.snapshotEns;
    const proposal = fetchedTask?.snapshotId;
    const url = isTest
      ? `https://demo.snapshot.org/#/${space}/proposal/${proposal}`
      : `https://snapshot.org/#/${space}/proposal/${proposal}`;
    window.open(url);
  } catch (error) {
    console.error(error);
  }
};
