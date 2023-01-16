import PlusIcon from 'components/Icons/plus';
import Tooltip from 'components/Tooltip';

import ButtonBase from '@mui/material/ButtonBase';
import styled from 'styled-components';
import palette from 'theme/palette';
import { CardWrapper } from './styles';

const AddButtonWrapper = styled(ButtonBase)`
  && {
    background: ${palette.grey87};
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 36px;
    cursor: pointer;
    display: flex;
    visibility: hidden;
    & svg {
      path {
        fill: ${palette.white};
      }
    }
    &:hover {
      background: ${palette.grey78};
    }
    ${CardWrapper}:hover & {
      visibility: visible;
    }
  }
`;

const AddButton = ({ onClick, text }) => (
  <Tooltip title={`Create new ${text.toLowerCase()}`} placement="top">
    <AddButtonWrapper onClick={onClick}>
      <PlusIcon />
    </AddButtonWrapper>
  </Tooltip>
);

export default AddButton;
