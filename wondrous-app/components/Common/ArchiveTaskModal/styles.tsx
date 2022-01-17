import { Box, Button, Dialog, Divider, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Button as ButtonComponent } from '../button'

export const StyledDialog = styled(Dialog)`
    border-radius: 6px;
    .MuiPaper-root {
        padding: 1px;
        background: linear-gradient(169.47deg, #4B4B4B 7.84%, #232323 108.71%);
        border-radius: 6px;
    }
`

export const StyledChildren = styled.div``

export const StyledBox = styled(Box)`
    width: 488px;
    height: 224px;
    background: linear-gradient(180deg, #262626 0%, #141414 100%);
    border-radius: 6px;
`

export const StyledCloseButton = styled(Button)`
    && {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0px;
        width: 34.9px;
        height: 34.9px;
        background: rgba(0, 0, 0, 1);
        margin-top: 20px;
        margin-left: 432px;

    :hover {
        background: rgba(0, 0, 0, 0.5)
    }   
}`

export const StyledHeader = styled(Typography)`
    && {font-family: Space Grotesk;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-align: left;
    color: #FFFFFF;
    margin-left: 24px;
    margin-top: -10px;
}
`

export const StyledDivider = styled(Divider)`
    && {
        background-color: #363636;
        width: 444px;
        height: 1px;
        margin: 0 auto;
        margin-top: 28px;}
`

export const StyledBody = styled(Typography)`
    && {
        font-family: Space Grotesk;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        letter-spacing: 0.01em;
        color: #C4C4C4;
        margin-left: 24px;
        margin-top: 14px;
    }
`

export const StyledButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 23px 24px 0 188px;
`

export const StyledCancelButton = styled(Button)`
   && {
    padding: 8px 30px;
    width: 107px;
    height: 39px;
    background: #232323;
    border-radius: 35px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #FFFFFF;

    :hover {
        background: rgba(35, 35, 35, 0.5);
    }
    }
`

export const StyledArchiveTaskButton = styled(ButtonComponent)`
    && {
        background: linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%);
        min-height: 0;
        min-width: 0;
        width: 144px;
        height: 40px;
        display: flex;
        padding: 4px 2px;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        color: #FFFFFF;
        opacity: 0.8;
        transition: opacity 0.25s;

        button {
            padding: 4px 6px;
            background: rgba(20, 20, 20, 1);
            font-size: 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        :hover {
            opacity: 1;
        }

        
    }
`

export const StyledArchivedLabel = styled(Typography)`
    && {
        margin-left: 6px;
        color: #fff;
        font-weight: 600;
        font-size: 15px;
        letter-spacing: -1%;
    }
`