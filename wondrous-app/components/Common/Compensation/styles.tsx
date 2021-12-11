import styled from 'styled-components'
import { Grey85 } from '../../../theme/colors'

export const CompensationWrapper = styled.div `
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    align-self: flex-end;
`

export const CompensationPill = styled.div `
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

export const IconContainer = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    height: 28px;
    border-radius: 28px;
    padding: 0;
    z-index: 2;
`

export const CompensationAmount = styled.div ``