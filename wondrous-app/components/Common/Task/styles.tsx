import styled from 'styled-components'
import {
    GradientMidnightDiagonal,
	GradientMidnightVertical,
} from '../gradients'
import { Grey80 } from '../../../theme/colors'

export const TaskInner = styled.div `
display: flex;
flex: 1 1 auto;
flex-direction: column;
flex-flow: column wrap;
align-items: stretch;

border-radius: 5px;
padding: 14px;

padding-bottom: 18px;

${GradientMidnightVertical}
`

export const TaskWrapper = styled.div `
display: flex;
margin: 1em 0 0 0;

padding: 1px;
background: #515151;

${GradientMidnightDiagonal}

border-radius: 6px;

min-width: 326px;
min-height: 216px;
width: 326px;    
`

export const TaskHeader = styled.div `
display: flex;
width: 100%;
text-align: left;

margin: 0 0 33px 0;
`

export const TaskContent = styled.div `
display: flex;
flex-grow: 1;
flex-direction: column;
justify-content: flex-start;
align-self: flex-start;
width: 100%;
font-size: 16px;
`

export const TaskSeparator = styled.div `
display: flex;
border-bottom: 1px solid ${Grey80};
margin-top: 5px;
`

export const TaskTitle = styled.div `
display: flex;
   
font-size: 16px;
font-weight: bold;
`

export const TaskFooter = styled.div `
display: flex;
align-self: flex-end;
align-items: center;

margin-top: 22px;

width: 100%;
flex-direction: row;
justify-content: flex-start;
height: 19px;
line-height: 19px;
`

export const TaskAction = styled.div `
display: flex;
flex-direction: row;
flext-content: flex-start;
align-content: space-between;
margin-right: 30px;
`

export const TaskActionMenu = styled.div `
display: flex;
flex-direction: row;
flex-grow: 1;
justify-content: flex-end;
height: 24px;
`

export const TaskActionAmount = styled.div `
display: flex;
flex-grow: 1;
justify-content: flex-start;
padding-left: 10px;
`
