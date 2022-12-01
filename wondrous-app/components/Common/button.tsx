import { ButtonProps, ButtonBase, Button as MuiButton, ButtonBaseProps } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import typography from 'theme/typography';

import { GradientHighlightHorizontal, GradientMidnightVertical } from './gradients';

const ButtonInner = styled.button`
  flex: 1 1 auto;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${GradientMidnightVertical};

  border-radius: 98px;
  font-size: 16px;
  border: none;
  color: white;
  padding: 12px;
  cursor: pointer;
  font-family: ${typography.fontFamily};
  &:hover {
    background: linear-gradient(82.03deg, #7427ff 50.7%, #00baff 107.99%);
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 40px;
  padding: 1px;
  margin-top: ${(props) => props.marginTop || 0};

  ${(props) => props.highlighted && GradientHighlightHorizontal}

  border-radius: 98px;
  &:hover {
    padding: 0;
  }
`;

export function Button({ children, disabled = false, ...props }) {
  return (
    <ButtonWrapper {...props}>
      <ButtonInner style={props?.buttonInnerStyle} disabled={disabled} type={props.type}>
        {children}
      </ButtonInner>
    </ButtonWrapper>
  );
}

const ButtonBasePrimary = styled(ButtonBase)`
  && {
    border-radius: 300px;
    height: 28px;
    margin: 0;
    padding: 1px;
    width: fit-content;
    ${GradientHighlightHorizontal};
  }
`;

const ButtonPrimaryInner = styled.div`
  && {
    align-items: center;
    background: ${({ theme }) => theme.palette.background.default};
    border-radius: inherit;
    display: flex;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    gap: 4px;
    height: 100%;
    font-weight: 600;
    justify-content: space-between;
    padding: ${({ withIcon }) => (withIcon ? '0px 8px 0 4px' : '0 8px')};
    transition: background 0.15s ease-in;
    width: 100%;
    :hover {
      background: transparent;
    }
  }
`;

export const ButtonPrimary = ({ children, startIcon, ...props }: ButtonProps): JSX.Element => (
  <ButtonBasePrimary {...props}>
    <ButtonPrimaryInner withIcon={startIcon}>
      {startIcon}
      {children}
    </ButtonPrimaryInner>
  </ButtonBasePrimary>
);
