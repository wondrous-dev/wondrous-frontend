import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/SideBar/styles';
import { SafeImage } from '../Image';

export const OrgProfilePicture = ({ profilePicture, style = {} }) => {
  if (profilePicture) {
    return <SafeImage src={profilePicture} style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }} />;
  }
  return (
    <NoLogoDAO style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}>
      <DAOIcon />
    </NoLogoDAO>
  );
};
