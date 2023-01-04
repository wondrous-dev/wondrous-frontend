import { DefaultUserImage, SafeImage } from 'components/Common/Image';
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
  ShowMoreButton,
} from './styles';

type Props = {
  podUsers: Array<any>;
  hasMore: boolean;
  handleShowMorePodUsers: () => void;
};

const ExistingMembers = (props: Props) => {
  const { podUsers, hasMore, handleShowMorePodUsers } = props;

  const getMemberWalletAddress = (address: string) => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
  };

  return (
    <MembersContainer>
      <ExistingMembersCount>{podUsers?.length} Members</ExistingMembersCount>

      <MembersList>
        {podUsers?.map(({ role, user }) => (
          <MemberRow key={user.id}>
            <MemberRowLeft>
              <MemberLink href={`/profile/${user.username}/about`} passHref>
                <SafeImage
                  useNextImage
                  src={user.profilePicture || user.thumbnailPicture}
                  placeholderComp={<DefaultUserImage style={{ width: '28px', height: '28px', borderRadius: '50%' }} />}
                  width={40}
                  height={40}
                  style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                  alt="Profile picture"
                />
                <MemberName>{user.username}</MemberName>
              </MemberLink>

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

      {hasMore && <ShowMoreButton onClick={handleShowMorePodUsers}>Show more</ShowMoreButton>}
    </MembersContainer>
  );
};

export default ExistingMembers;
