import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const ViewButton = styled.button`
    background: ${palette.highlightPurple};
    border: 0;
    z-index: 10;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-weight: 500;
    padding: 10px;
    cursor: pointer;
    height 36px;
    &:hover {
        background: transparent;
        border: 1px solid ${palette.highlightPurple};
    }
`;
