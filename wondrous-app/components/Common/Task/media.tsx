import React from 'react'
import styled from 'styled-components'

export const TaskImage = styled.img `
    display: flex;
    flex-grow: 1;
    width: 296px;
    height: 182px;
    border-radius: 6px;
    margin: 0 auto;
`

export const TaskVideo = styled.video `
    display: flex;
    flex-grow: 1;
    width: 296px;
    height: 166px;
    border-radius: 6px;
    margin: 0 auto;
`

export const TaskAudio = styled.audio `
    display: flex;
    flex-grow: 1;
    width: 296px;
    height: 54px;
    border-radius: 6px;
    margin: 0 auto;
`

export const TaskMediaWrapper = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 296px;
    margin: 0 auto;
`

export const TaskMedia = (props) => {
    
    let mediaType = props.media ? props.media.type : ''


    return (
        <TaskMediaWrapper key={'media-task-' + props.id}>
            {
                mediaType == 'image'
                ? (<TaskImage src={props.media.url} />)
                : mediaType == 'video' 
                    ? (<TaskVideo src={props.media.url} />)
                    : mediaType == 'audio'
                    ? (<TaskAudio src={props.media.url} />)
                    : (<span>Unsuported Media Type</span>)
            }
        </TaskMediaWrapper>
    )
}