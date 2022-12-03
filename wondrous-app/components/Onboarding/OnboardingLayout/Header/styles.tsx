import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px dashed #4b4b4b;
  flex-wrap: wrap;
  margin-bottom: 25px;
  padding-bottom: 25px;
`;

export const Wonder = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 24px;
    color: ${palette.white};
    margin-left: 12px;
  }
`;
