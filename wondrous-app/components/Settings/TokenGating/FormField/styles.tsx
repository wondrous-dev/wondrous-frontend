import Typography from '@mui/material/Typography';
import styled, { css } from 'styled-components';

import { greyColors } from 'theme/colors';

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
      border-radius: 4px;

      ${FieldLabel} {
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
    color: rgb(238, 72, 82);
    font-size: 13px;
    margin-top: 2px;
    color: ${({ theme }) => theme.palette.red400};
  }
`;
