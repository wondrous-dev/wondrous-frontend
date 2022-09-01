import { AVATAR_LIST_LARGE_OVERFLOW_MAX } from 'utils/constants';
import { AvatarContainer, AvatarListWrapper, AvatarWrapper } from './styles';

export function Avatar(props) {
  const { avatar = {}, id, initials = '', style = {} } = props;

  return (
    <AvatarContainer key={id} style={{ zIndex: 6 - style.zIndex }}>
      <AvatarWrapper randomColor={avatar.color} isOwnerOfPod={avatar.isOwnerOfPod} avatarURL={avatar.url}>
        {avatar.avatarURL ? '' : <span>{initials}</span>}
      </AvatarWrapper>
    </AvatarContainer>
  );
}

export function AvatarOverflow(props) {
  const { index = 0, overflow = 0 } = props;

  return (
    <AvatarContainer key={index} style={{ zIndex: AVATAR_LIST_LARGE_OVERFLOW_MAX + 1 }}>
      <AvatarWrapper avatarURL="/images/avatar-overflow.png">+{overflow}</AvatarWrapper>
    </AvatarContainer>
  );
}

export function AvatarList(props) {
  const { id = '', users = [] } = props;

  // Siege User List to max of AVATAR_LIST_OVERFLOW_MAX
  const usersSieged = users.slice(0, AVATAR_LIST_LARGE_OVERFLOW_MAX);
  const overflow = users.length - usersSieged.length;

  return (
    <AvatarListWrapper key={`${id}-list`}>
      {usersSieged.map((user, index) => (
        <Avatar
          id={user.id}
          key={`avatar-${user.id}`}
          avatar={user.avatar}
          initials={user.initials}
          style={{ zIndex: index }}
        />
      ))}
      {overflow > 0 && users.length > AVATAR_LIST_LARGE_OVERFLOW_MAX ? (
        <AvatarOverflow id={`avatar-overflow-${id}`} overflow={overflow} />
      ) : (
        ''
      )}
    </AvatarListWrapper>
  );
}
