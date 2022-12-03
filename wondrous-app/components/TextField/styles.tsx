import { InputUnstyled } from '@mui/base';
import Typography from '@mui/material/Typography';
import styled, { css } from 'styled-components';

import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import { greyColors } from 'theme/colors';

export const InputWrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 6px;
  padding: 12px;
  width: 100%;
`;

export const FieldInput = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: ${({ theme }) => theme.palette.background.default};
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: ${({ theme }) => theme.typography.fontFamily};
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      ${(props) => (props.multiline ? `height: 110px` : '')};
      resize: none;
      width: 100%;
      :focus-visible {
        outline: none;
      }
      ${ScrollBarStyles}
    }
  }
`;

export const DescriptionCharacterLength = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 12px;
    font-weight: 400;
    line-height: 19px;
    text-align: right;
    width: 100%;
    color: ${({ theme }) => theme.palette.grey250};
  }
`;

export const FieldLabelContainer = styled.div`
  ${(props) => props.labelWidth && `width: ${props.labelWidth}px`}
`;

export const FieldLabel = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.blue20};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 18px;
  }

  ${(props) =>
    props.labelType === 'highlighted' &&
    css`
      flex-direction: row;

      ${FieldLabel} {
        border-radius: 4px;
        padding: 11px 8px;
        background-color: ${greyColors.grey99};
        display: inline-block;
      }
    `}
`;

export const Error = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    color: ${({ theme }) => theme.palette.red800};
  }
`;
