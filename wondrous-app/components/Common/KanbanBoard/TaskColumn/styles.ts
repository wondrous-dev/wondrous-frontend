import { Typography } from '@material-ui/core'
import styled from 'styled-components'

export const TaskColumnContainer = styled.div`
	max-width: 325px;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const TaskColumnContainerHeader = styled.div`
	width: 100%;
	height: 24px;
	display: flex;
	align-items: center;
`

export const TaskColumnContainerHeaderTitle = styled(Typography)({
	'&.MuiTypography-body1': {
		fontWeight: 'bold',
		fontSize: 14,
		textAlign: 'left',
		color: '#FFF',
	},
})

export const TaskColumnContainerCount = styled(Typography)`
	&.MuiTypography-body1 {
		color: #828282;
		margin-left: 10px;
		font-size: 14px;
	}
`
