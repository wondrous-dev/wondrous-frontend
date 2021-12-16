import React from 'react'
import styled from 'styled-components'
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core'


export const MultiSelectForm = styled(FormControl)({
	'&.MuiFormControl-root': {
		width: 325,
		height: 40,
		background: 'linear-gradient(90.93deg, #1E1E1E 3.85%, #141414 101.76%)',
		borderRadius: 6,
	},

	'& .PrivateNotchedOutline-root-1': {
		border: 'none',
	}
})


export const MultiSelectInputLabel = styled(InputLabel)({

	'&.MuiInputLabel-formControl': {
		transform: 'translateY(50%)',
		fontSize: 14,
		display: 'flex',
		alignItems: 'center',
		lineHeight: '19px',
		letterSpacing: '0.01em',
		color: "#C4C4C4",
		zIndex: 1000,

		'& svg': {
			marginRight: 8,
			marginLeft: 12,
		},
	},
})

export const MultiSelectSelector = styled(Select)({
	'& .MuiSelect-root': {
		boxSizing: 'border-box',
		height: 40,
		display: 'flex',
		alignItems: 'center',
	}
})

export const MultiSelectMenuHeader = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const MultiSelectMenuItem = styled(MenuItem)({
	'&.MuiButtonBase-root': {
		background: '#121212',
		height: 35,
		color: '#C4C4C4',
		letterSpacing: '0.01em',
		fontSize: 14,
		lineHeight: '19px',
		borderRadius: 4,
		margin: '4px 0',
	},

	'&.MuiListItem-root.Mui-selected': {
		border: '1px solid #7427FF',
		color: '#CCBBFF',
	}
})

export const MultiSelectCounter = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #C4C4C4;
  }
`

export const MultiSelectClearButton = styled(Button)`
  && {
    border: 1px solid #7427FF;
    box-sizing: border-box;
    border-radius: 4px;
    width: 73px;
    height: 28px;
    
    //text
    font-weight: 500;
    font-size: 13px;
    line-height: 150%;
    color: #FFFFFF;
  }
`