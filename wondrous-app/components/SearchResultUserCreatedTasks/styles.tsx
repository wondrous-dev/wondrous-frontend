import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const Wrapper = styled.div`
  margin-top: 100px;
  margin-left: 20px;
  margin-right: 20px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${palette.black92};
  padding-bottom: 8px;
`;

export const Title = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: ${palette.white};
  }
`;

export const TotalTaskCount = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: ${palette.grey250};
  }
`;
