import { useState } from 'react';
import { ButtonGroupStyled, ButtonStyled } from './styles';

export function ButtonGroup(props) {
  const { selected, setSelected, buttons = [] } = props;

  return (
    <ButtonGroupStyled>
      {buttons.map((button, index) => (
        <ButtonStyled
          key={index}
          onClick={() => setSelected(index)}
          variant={selected === index ? 'contained' : 'outlined'}
        >
          {button}
        </ButtonStyled>
      ))}
    </ButtonGroupStyled>
  );
}
