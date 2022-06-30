import React from 'react';
import { Buttons, ButtonStyle } from './styles';

export const Button = (props) => {
  const { onClick, className } = props;
  return (
    <ButtonStyle>
      <Buttons onClick={onClick} className={className}>Button</Buttons>
    </ButtonStyle>
  );
};
