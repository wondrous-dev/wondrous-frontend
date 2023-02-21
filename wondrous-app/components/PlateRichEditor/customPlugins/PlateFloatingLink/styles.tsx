import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { BaseCard } from 'components/Common/card';
import palette from 'theme/palette';
import { tundora, greyColors } from 'theme/colors';

export const LinkModal = styled(BaseCard)`
  width: 480px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const LinkModalTitle = styled(Typography)`
  && {
    color: ${palette.white};
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 32px;
    margin-bottom: 8px;
  }
`;

export const FloatingRow = styled.div`
  padding: 8px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${tundora};

  button, a {
    color: white;
    background: none;
    border: none;
    height: 18px;
    cursor: pointer;
    
    &:hover {
      background-color: ${greyColors.grey52};
    }
  }
`;

export const LinkModalInput = styled(TextField)`
  && .MuiInputBase-root {
    padding: 6px 12px;
    color: ${palette.white};
    background: ${palette.background.default};
    border-radius: 6px;
  }

  && .MuiInputBase-input.Mui-disabled {
    color: ${palette.white};
    -webkit-text-fill-color: rgba(255, 255, 255, 0.5);
  }
`;
