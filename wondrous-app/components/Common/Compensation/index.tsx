import { ToDo } from '../../Icons'
import { WonderCoin } from '../../Icons/wonderCoin'
import { CompensationWrapper, IconContainer, CompensationPill, CompensationAmount } from './styles'

export const Compensation = (props) => {
    let amount = props.compensation ? props.compensation.amount : '---'

    let TaskIcon = props.icon || ToDo

    return (
        <CompensationWrapper key={props.id}>
            <IconContainer>
                <TaskIcon />
            </IconContainer>
            <CompensationPill>
                <IconContainer>
                    <WonderCoin/>
                </IconContainer>
                <CompensationAmount>
                    {amount}
                </CompensationAmount>
            </CompensationPill>
        </CompensationWrapper>
    )
}