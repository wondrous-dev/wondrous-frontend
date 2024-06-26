import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';

import palette from 'theme/palette';
import typography from 'theme/typography';

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
  width: ${(props) => (props.fullWidth ? '100%' : props.width || 'auto')};
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
  gap: ${(props) => props.gap || 0};
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || 400};
  font-family: ${typography.fontFamily};
  justify-content: center;
  padding: ${(props) => (typeof props.paddingY === 'number' ? props.paddingY : 0)}px
    ${(props) => (typeof props.paddingX === 'number' ? props.paddingX : 30)}px;
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : 'inherit')};
  &:hover:not(:disabled) {
    background: ${(props) => props?.hover?.background || props.background};
    color: ${(props) => props?.hover?.textColor || props.textColor};
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
  secondary: {
    background: palette.grey78,
    borderColor: palette.grey78,
    hover: {
      background: palette.grey58,
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
  blue: {
    borderColor: 'deepskyblue',
    background: 'deepskyblue',
    borderRadius: 6,
    hover: {
      background: palette.grey920,
    },
  },
  red: {
    borderColor: palette.red200,
    background: palette.red200,
    borderRadius: 6,
    hover: {
      background: palette.grey920,
    },
  },
};

type Props = SpaceProps & {
  /**
   * We include several predefined button styles,
   * each serving its own semantic purpose, with a few extras thrown in for more control.
   */
  id?: string;
  color?: 'primary' | 'secondary' | 'grey' | 'purple' | 'blue';
  children: ReactNode | undefined | string;
  minWidth?: number | string; // for values such as auto, fit-content, etc.
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
   * Make buttons look inactive and action accueeded by adding the succeeded boolean attribute to any button element.
   */
  succeeded?: boolean;
  /**
   * Create block level buttons—those that span the full width of a parent
   */
  fullWidth?: boolean;
  /**
   * 100% or any other value
   */
  width?: number | string;
  /**
   * Button has three different variants
   */
  variant?: 'outlined' | 'contained' | 'text';
  /**
   * gap of elments in button
   */
  gap?: string;

  onClick?: () => unknown;
  /**
   * You can customize colors for button
   */
  buttonTheme?: {
    paddingX?: number;
    paddingY?: number;
    background?: string;
    borderColor?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
    width?: number | string;
    height?: number | string;
    maxHeight?: number | string;
    hover?: {
      background?: string;
      textColor?: string;
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

  if (buttonTheme?.borderColor) {
    buttonProps.borderColor = buttonTheme.borderColor;
  }

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

  if (buttonProps.succeeded) {
    buttonProps.textColor = palette.green30;
    buttonProps.borderColor = palette.green30;
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
