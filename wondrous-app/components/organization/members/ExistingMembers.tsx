import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import {
  MemberName,
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

  return (
    <MembersContainer>
      <MembersList>
        {orgUsers?.map(({ role, user }) => (
          <MemberRow key={user.id}>
            <MemberRowLeft>
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

              {!!user.activeEthAddress && (
                <MemberWalletAddress>{user.activeEthAddress.slice(0, 11)}...</MemberWalletAddress>
              )}
            </MemberRowLeft>
            <MemberRowRight />
          </MemberRow>
        ))}
      </MembersList>
    </MembersContainer>
  );
};

export default ExistingMembers;
