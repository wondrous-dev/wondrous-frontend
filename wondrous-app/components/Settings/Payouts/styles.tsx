import { Checkbox, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';

export const LedgerHeaderButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const BatchPayoutButton = styled(CreateFormPreviewButton)`
  && {
    margin-left: 12px;
  }
`;

export const TableCellText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    text-align: center;
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  && {
    span {
      border: 1px solid white;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 12px;
      width: 12px;
    }
    input[type='checkbox'][disabled] {
      background: red;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 12px;
      width: 12px;
    }
  }
`;

export const LoadMore = styled.div`
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;
