import format from 'date-fns/format';
import { PERMISSIONS } from 'utils/constants';

export const filterRoles = (roles, userIsOwner) => {
  if (!roles) {
    return [];
  }
  return roles
    .filter((role) => {
      const hasOwnerPermissions = role?.permissions?.includes(PERMISSIONS.FULL_ACCESS);
      if (hasOwnerPermissions) {
        if (userIsOwner) {
          return true;
        }
        return false;
      }
      return true;
    })
    .map((role) => ({ label: role?.name, value: role?.id }));
};

export const exportMembersDataToCSV = (orgOrPodName, membersData) => {
  const orgName = orgOrPodName?.toLowerCase()?.split(' ')?.join('_');
  const headers = ['Username', 'Wallet Address', 'Role'];
  const rows = [[headers]];
  let csvContent = 'data:text/csv;charset=utf-8,';
  membersData.forEach(async ({ user, role }) => {
    const username = user?.username;
    const walletAddress = user?.activeEthAddress;
    const roleName = role?.name;

    const newRow = [username, walletAddress, roleName];
    rows.push(newRow);
  });
  rows.forEach((rowArray) => {
    const row = rowArray.join(',');
    csvContent += `${row}\r\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `wonderverse_${orgName}_members_${format(new Date(), 'MM/dd/yyyy')}.csv`);
  document.body.appendChild(link);
  link.click();
};
