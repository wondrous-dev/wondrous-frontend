import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import typography from 'theme/typography';
import palette from 'theme/palette';
export const EmptyStateGenericWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const EmptyStateGenericText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 13px;
    max-width: 35%;
    line-height: 19px;

    display: flex;
    align-items: center;
    letter-spacing: 0.01em;

    color: ${palette.white};
  }
`;
