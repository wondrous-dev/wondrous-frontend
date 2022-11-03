import React from 'react';
import styled from 'styled-components';
import {
  CreateFormInputLabel,
  CreateFormMenuItem,
  CreateFormSelect,
  CreateFormSelectBlock,
  CreateFormSelectBlockTitle,
} from 'components/Common/DropdownSelect/styles';
import { FormControl } from '@mui/material';

const MenuProps = {
  PaperProps: {
    style: {
      width: '100%',
      maxWidth: '555px',
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
      padding: '15px',

      '*::-webkit-scrollbar': {
        width: 100,
      },
    },
  },
};

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-right: 8px;
`;
function DropdownSelect(props) {
  const {
    title,
    labelText,
    labelIcon,
    options,
    name,
    value,
    setValue,
    formSelectStyle,
    disabled,
    titleStyle,
    onChange,
  } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange();
    }
  };

  return (
    <CreateFormSelectBlock
      style={{
        ...formSelectStyle,
        maxWidth: '555px',
        width: '100%',
      }}
    >
      <CreateFormSelectBlockTitle style={titleStyle}>{title}</CreateFormSelectBlockTitle>
      <FormControl>
        {!value && (
          <CreateFormInputLabel id={`select-label-${name}`} shrink={false}>
            {labelIcon}
            {labelText}
          </CreateFormInputLabel>
        )}

        <CreateFormSelect
          // IconComponent={CreateFormSelectArrowIcon}
          value={value}
          onChange={handleChange}
          MenuProps={MenuProps}
          labelId={`select-label-${name}`}
          id={`select-${name}`}
          disabled={disabled}
          style={{
            maxWidth: '555px',
            width: '100%',
          }}
        >
          {options.map((item) => (
            <CreateFormMenuItem key={item.value} value={item.value}>
              <Circle
                style={{
                  background: item.value,
                }}
              />
              {item.label}
              {item.amount && <span>{`(${item.amount})`}</span>}
            </CreateFormMenuItem>
          ))}
        </CreateFormSelect>
      </FormControl>
    </CreateFormSelectBlock>
  );
}

export default DropdownSelect;
