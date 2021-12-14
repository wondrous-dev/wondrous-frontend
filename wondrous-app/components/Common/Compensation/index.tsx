import { ToDo } from '../../Icons'
import { WonderCoin } from '../../Icons/wonderCoin'
import {
	CompensationWrapper,
	IconContainer,
	CompensationPill,
	CompensationAmount,
} from './styles'

export const Compensation = (props) => {
	const { icon = ToDo, compensation = {}, } = props	
	const { amount = '---', } = compensation

	const TaskIcon = icon

	return (
		<CompensationWrapper key={props.id}>
			<IconContainer>
				<TaskIcon />
			</IconContainer>
			<CompensationPill>
				<IconContainer>
					<WonderCoin />
				</IconContainer>
				<CompensationAmount>{amount}</CompensationAmount>
			</CompensationPill>
		</CompensationWrapper>
	)
}
