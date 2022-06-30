import React from 'react';
import { ButtonStyled, ButtonGroupStyled } from './styles';

export const ButtonGroup = (props) => {
  const { onClick, index, selected } = props;
  return (
    <ButtonGroupStyled>
      <ButtonStyled key={index} onClick={onClick} variant={selected === index ? 'contained' : 'outlined'}>
        button
      </ButtonStyled>
    </ButtonGroupStyled>
  );
};
