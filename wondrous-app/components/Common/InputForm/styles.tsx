import styled from 'styled-components';
import { IconButton, InputAdornment, InputBase } from '@mui/material';
import palette from 'theme/palette';

export const SearchInputBlock = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  background: #0f0f0f;
  border-radius: 6px;
  margin-bottom: ${(props) => (props.margin ? '28px' : '0')};
`;

export const SearchInput = styled(InputBase)`
  && {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    display: flex;
    align-items: center;

    //text
    .MuiInputBase-input {
      font-family: 'Space Grotesk';
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.01em;
      color: ${palette.white};
    }
  }
`;

export const SearchInputIcon = styled(InputAdornment)`
  && {
  }
`;

export const SearchInputIconButton = styled(IconButton)`
  && {
  }
`;
