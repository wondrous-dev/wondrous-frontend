import { useMemo } from 'react';

import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { SafeImage, DefaultUserImage } from 'components/Common/Image';

export const OrgProfilePicture = ({ profilePicture, style = {} }) => {
  const imageStyles = useMemo(
    () => ({
      height: '20px',
      width: '20px',
      borderRadius: '4px',
      ...style,
    }),
    [style]
  );

  if (profilePicture) {
    return <SafeImage src={profilePicture} style={imageStyles} alt="Profile picture" />;
  }
  return (
    <NoLogoDAO style={imageStyles}>
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
