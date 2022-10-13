import React, { useEffect, useState } from 'react';
import { FormControl } from '@mui/material';

import { SafeImage } from 'components/Common/Image';
import {
  CreateFormInputLabel,
  CreateFormMenuItem,
  CreateFormMenuItemIcon,
  CreateFormSelect,
  CreateFormSelectBlock,
  CreateFormSelectBlockTitle,
} from './styles';

const DEFAULT_MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: '250px',
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

interface DropdownSelectProps {
  title?: any;
  className?: any;
  labelText?: any;
  labelIcon?: any;
  options?: any;
  MenuProps?: any;
  IconComponent?: any;
  name?: any;
  value?: any;
  setValue?: any;
  formSelectStyle?: any;
  disabled?: any;
  titleStyle?: any;
  onChange?: any;
  innerStyle?: any;
  hideLabel?: any;
  labelStyle?: any;
  onOpen?: (value) => void;
}

function DropdownSelect({
  title,
  className, // missing
  labelText,
  labelIcon,
  options,
  MenuProps = DEFAULT_MENU_PROPS,
  IconComponent,
  name,
  value,
  setValue,
  formSelectStyle,
  disabled,
  titleStyle,
  onChange,
  innerStyle,
  hideLabel,
  labelStyle,
  onOpen
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);

    onChange && onChange();
  };

  useEffect(() => {
    if(onOpen) {
      onOpen(open)
    }
  }, [onOpen, open])

  return (
    <CreateFormSelectBlock style={formSelectStyle} className={className}>
      {!hideLabel && <CreateFormSelectBlockTitle style={titleStyle}>{title}</CreateFormSelectBlockTitle>}
      <FormControl>
        {!value && (
          <CreateFormInputLabel
            style={labelStyle}
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
          IconComponent={IconComponent}
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
                  useNextImage={false}
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
}

export default DropdownSelect;
