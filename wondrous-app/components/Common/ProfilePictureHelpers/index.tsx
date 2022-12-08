import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { SafeImage, DefaultUserImage } from 'components/Common/Image';

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

interface UserProfilePictureProps {
  avatar?: string;
  style?: React.CSSProperties;
};

export const UserProfilePicture = ({
  avatar,
  style = {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    marginRight: '4px',
  },
}: UserProfilePictureProps) =>
  avatar ? (
    <SafeImage useNextImage={false} style={style} src={avatar} alt="Profile picture" />
  ) : (
    <DefaultUserImage style={style} />
  );
