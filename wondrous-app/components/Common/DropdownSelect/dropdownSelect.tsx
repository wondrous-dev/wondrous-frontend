import React, { useRef, useState } from 'react';
import {
  CreateFormInputLabel,
  CreateFormMenuItem,
  CreateFormMenuItemIcon,
  CreateFormSelect,
  CreateFormSelectArrowIcon,
  CreateFormSelectBlock,
  CreateFormSelectBlockTitle,
} from './styles';
import { SafeImage } from '../Image';
import { FormControl } from '@material-ui/core';

const MenuProps = {
  PaperProps: {
    style: {
      width: '100%',
      maxWidth: 260,
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
      padding: '15px',

      '*::-webkit-scrollbar': {
        width: 100,
      },
    },
  },
};

const DropdownSelect = (props) => {
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
    innerStyle,
  } = props;

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) {
      onChange();
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <CreateFormSelectBlock style={formSelectStyle}>
      <CreateFormSelectBlockTitle style={titleStyle}>{title}</CreateFormSelectBlockTitle>
      <FormControl>
        {!value && (
          <CreateFormInputLabel
            id={`select-label-${name}`}
            htmlFor={`input-label-${name}`}
            shrink={false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {labelIcon}
            {labelText}
          </CreateFormInputLabel>
        )}

        <CreateFormSelect
          // IconComponent={CreateFormSelectArrowIcon}
          value={value || ''}
          open={open}
          onClick={() => {
            setOpen(!open);
          }}
          onChange={handleChange}
          MenuProps={MenuProps}
          labelId={`select-label-${name}`}
          id={`select-${name}`}
          disabled={disabled}
          style={innerStyle}
          label={labelText}
        >
          {options.map((item) => (
            <CreateFormMenuItem key={item.value} value={item.value}>
              {item?.imageUrl ? (
                <SafeImage
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '20px',
                    marginRight: '8px',
                  }}
                  src={item?.imageUrl}
                />
              ) : (
                <CreateFormMenuItemIcon>{item.icon || labelIcon}</CreateFormMenuItemIcon>
              )}
              {item.label}
              {item.amount && <span>{`(${item.amount})`}</span>}
            </CreateFormMenuItem>
          ))}
        </CreateFormSelect>
      </FormControl>
    </CreateFormSelectBlock>
  );
};

export default DropdownSelect;
