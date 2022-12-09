import { useMe } from 'components/Auth/withAuth';
import { ChevronFilled } from 'components/Icons/sections';
import useMediaQuery from 'hooks/useMediaQuery';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { HeaderUserProfileWrapper } from './styles';

const HeaderUserProfile = ({ handleClick, isActive }) => {
  const user = useMe();
  const { isMobileScreen } = useMediaQuery();

  return (
    <HeaderUserProfileWrapper onClick={handleClick} open={isActive}>
      <UserProfilePicture avatar={user?.profilePicture} style={{height: '31px', width: '31px'}}/>
      {isMobileScreen ? null : user?.username}
      <ChevronFilled fill="white" className="accordion-expansion-icon" />
    </HeaderUserProfileWrapper>
  );
};

export default HeaderUserProfile;
