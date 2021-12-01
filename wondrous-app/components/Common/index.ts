import styled from 'styled-components'

export const Flex = styled.div`
	flex: 1;
`

export const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
`

export const CenteredFlexRow = styled(FlexRow)`
	align-items: center;
`

export const NewCanvas = styled.canvas`
	position: absolute;
	top: 0;
	left: 0;
	width: 50px;
	height: 50px;
`
