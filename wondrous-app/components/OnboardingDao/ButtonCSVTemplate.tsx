import { ButtonBase } from '@mui/material';
import styled from 'styled-components';

const Button = styled(ButtonBase)`
  && {
    align-items: center;
    background: #313131;
    border-radius: 6px;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    flex-direction: row;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    height: 38px;
    justify-content: center;
    padding: 10px;
    width: 113px;
  }
`;

const ButtonCSVTemplate = () => {
  return <Button>CSV Template</Button>;
};

export default ButtonCSVTemplate;
