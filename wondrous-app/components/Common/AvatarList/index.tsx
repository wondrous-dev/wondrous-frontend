import React from 'react'
import * as Colors from '../../../theme/colors'
import { SmallAvatarWrapper, BlackAura, AvatarListWrapper } from './styles'

export const OVERFLOW_MAX = 5

export const SmallAvatar = (props) => {
    let avatar = props.avatar || {}

    //TODO: create this as a service
    let keys = Object.keys(Colors)
    const randomColor = Colors[keys[Math.floor(Math.random() * keys.length)]]

    return (
        <BlackAura key={props.id} style={{ zIndex: 6 - props.style.zIndex }}>
            <SmallAvatarWrapper key={avatar.id} randomColor={randomColor} isOwnerOfPod={avatar.isOwnerOfPod} avatarURL={avatar.url} >
                {
                    avatar.avatarURL ? '' : (<span>{props.initials}</span>)
                }
            </SmallAvatarWrapper>
        </BlackAura>
    )
}

export const SmallAvatarOverflow = (props) => {
    return (
        <BlackAura key={props.id} style={{ zIndex: 7 }}>
            <SmallAvatarWrapper avatarURL='/images/avatar-overflow.png' >
                +{props.overflow}
            </SmallAvatarWrapper>
        </BlackAura>
    )
}

export const AvatarList = (props) => {
    
    // Siege User List to max of OVERFLOW_MAX
    let users = props.users ? props.users.length > 6 ? props.users.slice(0,OVERFLOW_MAX) : props.users : []
    let overflow = props.users ? props.users.length - users.length : 0 

    return (
        <AvatarListWrapper key={props.id + '-list'}>
        {
            users.map((user, id) => <SmallAvatar key={'avatar-' + user.id} avatar={user.avatar} initials={user.initials} style={{ zIndex: id }} />)
        }
        {
            overflow > 0
            ? props.users.length > OVERFLOW_MAX
                ? <SmallAvatarOverflow overflow={overflow}/>
                : ''
            : ''
        }
        </AvatarListWrapper>
    )
}