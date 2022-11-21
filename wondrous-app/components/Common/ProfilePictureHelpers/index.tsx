import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

export const OrgProfilePicture = ({ profilePicture, style = {} }) => {
  if (profilePicture) {
    return (
      <SafeImage
        src={profilePicture}
        style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}
        alt="Profile picture"
      />
    );
  }
  return (
    <NoLogoDAO style={{ height: '20px', width: '20px', borderRadius: '4px', ...style }}>
      <DAOIcon />
    </NoLogoDAO>
  );
};

export const UserProfilePicture = ({
  avatar,
  style = {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    marginRight: '4px',
  },
}) =>
  avatar ? (
    <SafeImage useNextImage={false} style={style} src={avatar} alt="Profile picture" />
  ) : (
    <DefaultUserImage style={style} />
  );
