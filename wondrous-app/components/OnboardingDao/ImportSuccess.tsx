import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const ImportSuccessWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 6px;
  background: rgba(6, 255, 165, 0.1);
  border-radius: 4px;
  width: fit-content;
`;

const ImportSuccessText = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    background: ${({ theme }) => `linear-gradient(180deg, ${theme.palette.white} 0%, ${theme.palette.green800} 100%)`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const ImportSuccess = ({ children }) => (
  <ImportSuccessWrapper>
    <ImportSuccessText>{children}</ImportSuccessText>
  </ImportSuccessWrapper>
);

export default ImportSuccess;
