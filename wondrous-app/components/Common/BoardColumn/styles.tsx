import styled from 'styled-components'

export const BoardColumnWrapper = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;

    font-weight: bold;

    min-width: 200px; 
`

export const BoardColumnTitle = styled.h3 `
    width: 100%;
    display: flex;
    line-height: 24px;
    font-size: 18px;
    font-weight: 400;
    text-align: left;
    padding-left: 15px;
    vertical-align: middle;
`

export const IconWrapper = styled.div `
    display: flex;
    width: 24px;
    line-height: 24px;
    margin-right: 10px;
`