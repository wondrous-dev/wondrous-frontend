import styled from 'styled-components'
import { HighlightBlue } from '../../../services/colors'
import * as Colors from '../../../services/colors'

/* 
    Avatar List display of users.
    -----------------------------
*/

export const OVERFLOW_MAX = 5

export const SmallAvatarWrapper = styled.div `
    display: flex;
    align-self: flex-start;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: 27px;
    height: 27px;
    border-radius: 27px;
    box-shadow: 0 2px solid black;
    border: ${props => (props.isOwnerOfPod ? '1.5px solid ' + HighlightBlue : '1.5px solid black')};
    background-color: ${props => (props.randomColor)};
    ${props => (props.avatarURL ? 'background: url(' + props.avatarURL + ');' : '')}
    background-position: center;
    background-size: cover;

    font-size: 10px;
`

const BlackAura = styled.div `
    min-width: 27px;
    min-height: 27px;
    border-radius: 27px;
    margin-left: -6px;
    border: 1px solid black;
    background: black;
    padding: 0;
`

const AvatarListWrapper = styled.div `
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    margin-left: 16px;

`
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