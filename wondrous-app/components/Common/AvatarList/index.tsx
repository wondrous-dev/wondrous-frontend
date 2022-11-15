import React from 'react';
import Box from '@mui/system/Box';
import { AVATAR_LIST_OVERFLOW_MAX } from 'utils/constants';
import Tooltip from 'components/Tooltip';
import { useRouter } from 'next/router';
import { SafeImage } from '../Image';
import { SmallAvatarWrapper, SmallAvatarContainer, AvatarListWrapper } from './styles';

export function SmallAvatar(props) {
  const {
    avatar = {},
    id,
    username,
    goTo,
    initials = '',
    style = {},
    imageWidth = 29,
    imageHeight = 29,
    border = '',
  } = props;

  // TODO: create this as a service
  const randomColor = '#363636';

  return (
    <SmallAvatarContainer
      key={id}
      onClick={() => {
        if (goTo) {
          goTo(username);
        }
      }}
      style={{ ...style, zIndex: 6 - (style.zIndex || 0) }}
    >
      {avatar.url ? (
        <Box
          sx={{
            display: 'flex',
            alignSelf: 'flex-start',
            flexFlow: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SafeImage
            width={imageWidth}
            height={imageHeight}
            src={avatar.url}
            useNextImage
            style={{
              objectFit: 'cover',
              borderRadius: '29px',
            }}
          />
        </Box>
      ) : (
        <SmallAvatarWrapper
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          randomColor={avatar?.color || randomColor}
          isOwnerOfPod={avatar?.isOwnerOfPod}
          avatarURL={avatar?.url}
          border={border}
        >
          {avatar.url ? '' : <span>{initials}</span>}
        </SmallAvatarWrapper>
      )}
    </SmallAvatarContainer>
  );
}

export function SmallAvatarOverflow(props) {
  const { index = 0, overflow = 0 } = props;

  return (
    <SmallAvatarContainer key={index} style={{ zIndex: AVATAR_LIST_OVERFLOW_MAX + 1 }}>
      <SmallAvatarWrapper avatarURL="/images/avatar-overflow.png">+{overflow}</SmallAvatarWrapper>
    </SmallAvatarContainer>
  );
}

export function AvatarList(props) {
  const { id = '', users = [], align = '', style = {} } = props;
  const router = useRouter();

  // Siege User List to max of AVATAR_LIST_OVERFLOW_MAX
  const usersSieged = users.slice(0, AVATAR_LIST_OVERFLOW_MAX);
  const overflow = users.length - usersSieged.length;

  const goToUser = (username) => {
    window.location.href = `/profile/${username}/about`;
  };

  return (
    <AvatarListWrapper key={`${id}-list`} align={align} style={style}>
      {usersSieged.map((user, index) => (
        <Tooltip key={`user-tooltip-${user.id}`} title={user.name || user.initials} placement="top">
          <div>
            <SmallAvatar
              id={user.id}
              username={user.username || user?.name}
              key={`avatar-${user.id}`}
              avatar={user.avatar}
              initials={user.initials}
              style={{ zIndex: index }}
              goTo={goToUser}
            />
          </div>
        </Tooltip>
      ))}
      {overflow > 0 && users.length > AVATAR_LIST_OVERFLOW_MAX ? (
        <SmallAvatarOverflow id={`avatar-overflow-${id}`} overflow={overflow} />
      ) : (
        ''
      )}
    </AvatarListWrapper>
  );
}
