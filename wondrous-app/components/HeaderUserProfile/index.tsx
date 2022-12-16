import { useMe } from 'components/Auth/withAuth';
import { ChevronFilled } from 'components/Icons/sections';
import useMediaQuery from 'hooks/useMediaQuery';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { HeaderUserProfileWrapper } from './styles';

const HeaderUserProfile = ({ handleClick, open, isActive }) => {
  const user = useMe();
  const { isMobileScreen } = useMediaQuery();

  return (
    <HeaderUserProfileWrapper
      id="tour-header-personal-navigation"
      onClick={handleClick}
      open={open}
      isActive={isActive}
    >
      <UserProfilePicture
        avatar={user?.profilePicture}
        style={{ height: '31px', width: '31px', borderRadius: '13px' }}
      />
      {isMobileScreen ? null : user?.username}
      <ChevronFilled fill="white" className="accordion-expansion-icon" />
    </HeaderUserProfileWrapper>
  );
};

export default HeaderUserProfile;
