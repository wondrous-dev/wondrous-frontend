import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/Common/SidebarMain/styles';
import { SafeImage, DefaultUserImage } from 'components/Common/Image';
import { useState } from 'react';
import GR15DEIModal from '../IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from '../IntiativesModal/GR15DEIModal/GR15DEILogo';

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
}

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

interface UserProfilePictureGR15Props extends UserProfilePictureProps {
  isGr15Contributor: boolean;
}

export const UserProfilePictureGR15 = ({
  avatar,
  style = {
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    marginRight: '4px',
  },
  isGr15Contributor,
}: UserProfilePictureGR15Props) => {
  const [openGR15Modal, setOpenGR15Modal] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <UserProfilePicture avatar={avatar} style={style} />
      {isGr15Contributor && (
        <>
          <GR15DEIModal open={openGR15Modal} onClose={() => setOpenGR15Modal(false)} />
          <GR15DEILogo
            width="42"
            height="42"
            onClick={() => setOpenGR15Modal(true)}
            style={{
              top: '0',
              right: '-20px',
              position: 'absolute',
              zIndex: '20',
            }}
          />
        </>
      )}
    </div>
  );
};
