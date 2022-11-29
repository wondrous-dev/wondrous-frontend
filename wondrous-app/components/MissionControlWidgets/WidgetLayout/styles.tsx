import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${palette.grey900};
  border-radius: 6px;
  min-width: 30%;
  flex: 1;
  padding: 10px;
  width: 100%;
`;

export const Title = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    margin-bottom: 12px;
    letter-spacing: 0.0025em;

    color: ${palette.blue20};
  }
`;

export const ChildrenWrapper = styled.div``;
