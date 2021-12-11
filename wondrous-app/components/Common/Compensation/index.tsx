import styled from 'styled-components'
import { ToDo, InProgress, Done } from '../../Icons'
import { WonderCoin } from '../../Icons/wonderCoin'
import { Button } from '../button'
import { Grey85, Grey400 } from '../../../services/colors'

const CompensationWrapper = styled.div `
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    align-self: flex-end;
`

const CompensationPill = styled.div `
    display: flex;
    align-self: flex-end;
    flex-direction: row;
    justify-content: center;
    background: ${Grey85};
    border-radius: 25px;
    min-width: 60px;
    height: 28px;
    line-height: 28px;  
    margin-left: -5px;
    z-index: 0;
`

const IconContainer = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    height: 28px;
    border-radius: 28px;
    padding: 0;
    z-index: 2;
`

const CompensationAmount = styled.div `
    
`

export const Compensation = (props) => {
    let amount = props.compensation ? props.compensation.amount : '---'

    return (
        <CompensationWrapper>
            <IconContainer>
                <ToDo />
            </IconContainer>
            <CompensationPill>
                <IconContainer style={{  }}>
                    <WonderCoin class='compensation-wonder-coin' />
                </IconContainer>
                <CompensationAmount>
                    {amount}
                </CompensationAmount>
            </CompensationPill>
        </CompensationWrapper>
    )
}