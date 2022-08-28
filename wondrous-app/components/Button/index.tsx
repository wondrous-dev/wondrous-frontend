import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ResponsiveValue, space, SpaceProps } from 'styled-system';

import palette from 'theme/palette';

const ButtonWrapper = styled.div`
  ${space};
  background: ${(props) => props.borderColor};
  border-radius: ${(props) => (!isNaN(props.borderRadius) ? props.borderRadius : 50)}px;
  display: flex;
  flex-direction: row;
  height: ${(props) => props.height || 40}px;
  min-height: ${(props) => props.height || 40}px;
  min-width: ${(props) => props.minWidth || 0}px;
  padding: 1px;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const ButtonInner = styled.button`
  align-items: center;
  background: ${(props) => props.background};
  border-radius: ${(props) => (!isNaN(props.borderRadius) ? props.borderRadius : 50)}px;
  border: none;
  color: ${(props) => props.textColor || 'white'};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  font-size: 16px;
  justify-content: center;
  padding: 0 ${(props) => props.paddingX || 30}px;

  &:hover:not(:disabled) {
    background: ${(props) => props?.hover?.background || props.background};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const theme = {
  primary: {
    borderColor: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
    background: 'linear-gradient(0deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%)',
    hover: {
      background:
        'linear-gradient(270deg, rgb(204, 187, 255) -5.62%, rgb(116, 39, 255) 45.92%, rgb(0, 186, 255) 103.12%)',
    },
  },
  grey: {
    background: palette.mineShaft,
    borderColor: palette.mineShaft,
    hover: {
      background: palette.tundora,
    },
  },
  purple: {
    borderColor: palette.electricViolet,
    background: palette.electricViolet,
    borderRadius: 6,
  },
};

type Props = SpaceProps & {
  /**
   * We include several predefined button styles,
   * each serving its own semantic purpose, with a few extras thrown in for more control.
   */
  color?: 'primary' | 'grey' | 'purple';
  children: ReactNode | undefined | string;
  minWidth?: number;
  height?: number;
  /**
   * Button can have custom shapes defined via borderRadius prop
   */
  borderRadius?: number;
  textColor?: string;
  /**
   * For name to submit
   */
  form?: string;
  /**
   * Button type
   */
  type?: 'submit' | 'button';
  /**
   * Make buttons look inactive by adding the disabled boolean attribute to any button element.
   */
  disabled?: boolean;
  /**
   * Create block level buttons—those that span the full width of a parent
   */
  fullWidth?: boolean;
  /**
   * Button has three different variants
   */
  variant?: 'outlined' | 'contained' | 'text';

  onClick?: () => unknown;
  /**
   * You can customize colors for button
   */
  buttonTheme?: {
    paddingX?: number;
    background?: string;
    borderColor?: string;
    hover?: {
      background?: string;
    };
  };
};

export const Button = ({
  color = 'primary',
  variant = 'contained',
  onClick,
  buttonTheme,
  children,
  ...props
}: Props) => {
  const buttonProps = { ...theme[color], ...props };

  if (variant === 'outlined') {
    buttonProps.borderColor = buttonProps.background;
    buttonProps.background = palette.background.default;
  } else if (variant === 'text') {
    buttonProps.textColor = buttonProps.background;
    buttonProps.borderColor = palette.background.default;
    buttonProps.background = palette.background.default;
  }

  if (buttonProps.disabled) {
    buttonProps.textColor = palette.grey60;
    buttonProps.borderColor = palette.grey60;
    buttonProps.background = palette.background.default;
  }

  return (
    <ButtonWrapper {...buttonProps}>
      <ButtonInner {...buttonProps} {...buttonTheme} onClick={onClick}>
        {children}
      </ButtonInner>
    </ButtonWrapper>
  );
};

export default Button;
