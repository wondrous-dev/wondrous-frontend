import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import { NoUnderlineLink } from 'components/Common/Link/links';
import RolePill from 'components/Common/RolePill';
import palette from 'theme/palette';
import {
  ExistingMembersCount,
  MemberLink,
  MemberName,
  MemberPodCount,
  MemberRow,
  MemberRowLeft,
  MemberRowRight,
  MembersContainer,
  MembersList,
  MemberWalletAddress,
} from './styles';

type Props = {
  orgUsers: Array<any>;
};

const ExistingMembers = (props: Props) => {
  const { orgUsers } = props;

  const getMemberWalletAddress = (address: string) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
  };

  return (
    <MembersContainer>
      <ExistingMembersCount>{orgUsers?.length} Members</ExistingMembersCount>

      <MembersList>
        {orgUsers?.map(({ role, user }) => (
          <MemberRow key={user.id}>
            <MemberRowLeft>
              <NoUnderlineLink href={`/profile/${user.username}/about`} passHref>
                <MemberLink>
                  <SafeImage
                    useNextImage
                    src={user.profilePicture || user.thumbnailPicture}
                    placeholderComp={
                      <DefaultUserImage style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    }
                    width={40}
                    height={40}
                    style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                    alt="Profile picture"
                  />
                  <MemberName>{user.username}</MemberName>
                </MemberLink>
              </NoUnderlineLink>

              {!!user.activeEthAddress && (
                <MemberWalletAddress>{getMemberWalletAddress(user.activeEthAddress)}</MemberWalletAddress>
              )}
            </MemberRowLeft>

            <MemberRowRight>
              <MemberPodCount>{user?.additionalInfo?.podCount} pods</MemberPodCount>

              <RolePill roleName={role?.name} backgroundColor={palette.grey85} />
            </MemberRowRight>
          </MemberRow>
        ))}
      </MembersList>
    </MembersContainer>
  );
};

export default ExistingMembers;
