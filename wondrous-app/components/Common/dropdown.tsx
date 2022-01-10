import React, { useState } from 'react'
import styled from 'styled-components'
import {
	GradientMidnightDiagonalOposite,
	GradientMidnightVertical,
} from './gradients'

const DropDownWrapper = styled.div`
    position: absolute;
    min-width: 185px;
    min-height: 30px;
    padding: 4px 2px;
    margin-left: -145px;
    margin-top: 9px;

    border-radius: 5px;
    background: black;

    ${GradientMidnightDiagonalOposite}

    transition: 0.2s display;
    z-index: 100;

    display: flex;
    flex-direction: column;
    justify-content; space-evenly;
`

const DropDownArrow = styled.div`
	position: absolute;
	height: 40px;
	width: 40px;

	background: #414344;
	border-radius: 8px;
	transform: rotate(45deg);

	margin-left: -7px;
	margin-top: 2px;

	content: '';
	z-index: 99;
`

export const DropDownItem = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	padding: 4px 8px;
	height: 32px;
	line-height: 32px;
	color: ${(props) => props.color};
	font-size: ${(props) => props.fontSize};
	font-weight: ${(props) => props.fontWeight};

	cursor: pointer;

	:hover {
		${GradientMidnightVertical}
		border-radius: 5px;
	}
`

export const DropdownOverlay = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: transparent;
	z-index: 97;
`

export const DropDown = (props) => {
	const { DropdownHandler, children } = props
	const [isOpen, setIsOpen] = useState(false)

	const toggleDropDown = () => {
		setIsOpen(!isOpen)
	}

	const display = isOpen ? 'block' : 'none'

	return (
		<>
			<DropdownOverlay onClick={toggleDropDown} style={{ display: display }} />
			<div onClick={toggleDropDown}>
				<DropdownHandler {...props} />
				<DropDownWrapper style={{ display: display }}>
					{children}
				</DropDownWrapper>
				<DropDownArrow style={{ display: display }} />
			</div>
		</>
	)
}
