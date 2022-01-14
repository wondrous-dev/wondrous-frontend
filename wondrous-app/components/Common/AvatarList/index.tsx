import React from 'react'
import * as Colors from '../../../theme/colors'
import {
  SmallAvatarWrapper,
  SmallAvatarContainer,
  AvatarListWrapper,
} from './styles'
import { AVATAR_LIST_OVERFLOW_MAX } from '../../../utils/constants'

export const SmallAvatar = (props) => {
  const { avatar = {}, id, goTo, initials = '', style = {} } = props

  //TODO: create this as a service
  const colorValues = Object.values(Colors)
  const randomColor =
    colorValues[Math.floor(Math.random() * colorValues.length)]

  return (
    <SmallAvatarContainer
      key={id}
      onClick={() => { goTo(id) }}
      style={{ ...style, zIndex: 6 - (style.zIndex || 0) }}
    >
      <SmallAvatarWrapper
        randomColor={avatar?.color || randomColor}
        isOwnerOfPod={avatar?.isOwnerOfPod}
        avatarURL={avatar?.url}
      >
        {avatar.avatarURL ? '' : <span>{initials}</span>}
      </SmallAvatarWrapper>
    </SmallAvatarContainer>
  )
}

export const SmallAvatarOverflow = (props) => {
  const { index = 0, overflow = 0 } = props

  return (
    <SmallAvatarContainer
      key={index}
      style={{ zIndex: AVATAR_LIST_OVERFLOW_MAX + 1 }}
    >
      <SmallAvatarWrapper avatarURL="/images/avatar-overflow.png">
        +{overflow}
      </SmallAvatarWrapper>
    </SmallAvatarContainer>
  )
}

export const AvatarList = (props) => {
  const { id = '', users = [], align = '', style = {} } = props

  // Siege User List to max of AVATAR_LIST_OVERFLOW_MAX
  let usersSieged = users.slice(0, AVATAR_LIST_OVERFLOW_MAX)
  let overflow = users.length - usersSieged.length

  const goToUser = (userId) => {
    console.log('User tap: ', userId)
  }

  return (
    <AvatarListWrapper key={id + '-list'} align={align} style={style}>
      {usersSieged.map((user, index) => (
        <SmallAvatar
          id={user.id}
          key={'avatar-' + user.id}
          avatar={user.avatar}
          initials={user.initials}
          style={{ zIndex: index }}
          goTo={goToUser}
        />
      ))}
      {overflow > 0 && users.length > AVATAR_LIST_OVERFLOW_MAX ? (
        <SmallAvatarOverflow id={'avatar-overflow-' + id} overflow={overflow} />
      ) : (
        ''
      )}
    </AvatarListWrapper>
  )
}
