import { ButtonBase } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const DropdownButton = styled(ButtonBase)`
  && {
    background: transparent;
    width: max-content;
    height: max-content;
  }
`;

export const DropdownWrapper = styled.div`
  background: ${palette.grey900};
  border-radius: 6px;
  border: 1px solid ${palette.grey75};
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  margin-top: 4px;
  min-height: 30px;
  min-width: 185px;
  padding: 10px 2px;
  width: fit-content;
  z-index: 1000;
`;
