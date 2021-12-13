import styled from 'styled-components'
import ReactPlayer from 'react-player/lazy'

export const TaskImage = styled.img`
	display: flex;
	flex-grow: 1;
	width: 296px;
	height: 182px;
	border-radius: 6px;
	margin: 0 auto;
`

export const TaskVideo = styled(ReactPlayer)`
	display: flex;
	flex-grow: 1;
	max-width: 296px;
	min-height: 166px;
	border-radius: 6px;
	margin: 0 auto;

	iframe {
		border-radius: 10px;
	}
`

export const TaskAudio = styled(ReactPlayer)`
	display: flex;
	flex-grow: 1;
	max-width: 296px;
	height: 54px;
	border-radius: 6px;
	margin: 0 auto;

	iframe {
		border-radius: 10px;
	}

`
export const TaskMediaUnsuported = styled.div`
position: flex;
height: flex-grow: 1;
max-width: 296px;
min-height: 166px;
margin: 0 auto;
`

export const TaskMediaWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 296px;
	margin: 0 auto;
`
