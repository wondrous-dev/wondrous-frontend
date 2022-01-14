import React, { useState } from 'react'
import { FormControl } from '@material-ui/core'
import {
  CreateFormInputLabel,
  CreateFormMenuItem,
  CreateFormMenuItemIcon,
  CreateFormSelect,
  CreateFormSelectArrowIcon,
  CreateFormSelectBlock,
  CreateFormSelectBlockTitle,
} from './styles'
import { SafeImage } from '../Image'

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
}

const DropdownSelect = (props) => {
  const { title, labelText, labelIcon, options, name, value, setValue } = props

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <CreateFormSelectBlock>
      <CreateFormSelectBlockTitle>{title}</CreateFormSelectBlockTitle>
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
  )
}

export default DropdownSelect
