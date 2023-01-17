import { useMemo } from 'react';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import RolePill from 'components/Common/RolePill';
import palette from 'theme/palette';
import { getAddressToDisplay } from 'utils/helpers';
import {
  ExistingMembersCount,
  MemberLink,
  MemberName,
  MemberRow,
  MemberRowLeft,
  MemberRowRight,
  MembersContainer,
  MembersList,
  MemberWalletAddress,
  ShowMoreButton,
} from './styles';

type ExistingMembersProps = {
  existingUsers: Array<any>;
  contributorsCount: number;
  hasMore: boolean;
  handleShowMoreUsers: () => void;
};

type ExistingMemberRowProps = {
  role: { name: string };
  user: { id: string; username: string; profilePicture: string; thumbnailPicture: string; activeEthAddress: string };
};

const ExistingMemberRow = (props: ExistingMemberRowProps) => {
  const { role, user } = props;

  const memberWalletAddress = useMemo(() => getAddressToDisplay(user.activeEthAddress), [user.activeEthAddress]);

  return (
    <MemberRow>
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

        {!!user.activeEthAddress && <MemberWalletAddress>{memberWalletAddress}</MemberWalletAddress>}
      </MemberRowLeft>

      <MemberRowRight>
        <RolePill roleName={role?.name} backgroundColor={palette.grey85} />
      </MemberRowRight>
    </MemberRow>
  );
};

const ExistingMembers = (props: ExistingMembersProps) => {
  const { existingUsers, hasMore, handleShowMoreUsers, contributorsCount } = props;

  return (
    <MembersContainer>
      <ExistingMembersCount>{contributorsCount} Members</ExistingMembersCount>

      <MembersList>
        {existingUsers?.map(({ role, user }) => (
          <ExistingMemberRow key={user.id} role={role} user={user} />
        ))}
      </MembersList>

      {hasMore && <ShowMoreButton onClick={handleShowMoreUsers}>Show more</ShowMoreButton>}
    </MembersContainer>
  );
};

export default ExistingMembers;
