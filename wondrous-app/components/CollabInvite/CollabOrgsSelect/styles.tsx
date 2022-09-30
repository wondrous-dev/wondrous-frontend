import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px;
  gap: 14px;
  width: 100%;
  background: ${palette.black97};
  border-radius: 6px;
  font-family: ${typography.fontFamily};
  margin-top: 18px;
`;

export const WrapperHeader = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 14px;
    font-weight: 500;
    font-family: ${typography.fontFamily};
    font-style: normal;
    line-height: 18px;
    text-align: center;
  }
`;

export const WrapperSubheader = styled(Typography)`
  && {
    font-size: 13px;
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-style: normal;
    line-height: 18px;
    font-weight: 400;
  }
`;
