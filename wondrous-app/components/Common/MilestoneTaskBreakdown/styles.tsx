import styled from 'styled-components';
import { Box } from '@material-ui/core';

export const StyledTableContainer = styled.div``

export const StyledBoxWrapper = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`

export const StyledBox = styled(Box)`
    background: #0f0f0f;
    border-radius: 6px;
    display: flex;
    align-items: center;
    width: 32%;
    color: #CCBBFF;
    font-size: 14px;
    font-weight: 500;
    padding: 6px;
    margin-bottom:8px;

    svg {
        margin-right: 10px;
    }
`

