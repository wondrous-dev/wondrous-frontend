import React, { Component, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grey75 } from '../../theme/colors'
import {
	GradientMidnightDiagonalOposite,
	GradientMidnightVertical,
} from './gradients'

const DropDownWrapper = styled.div`
    position: absolute;
    min-width: 233px;
    min-height: 30px;
    padding: 4px 2px;
    margin-left: -192px;
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

	cursor: pointer;

	:hover {
		${GradientMidnightVertical}
		border-radius: 5px;
	}
`

export const DropdownOverlay = styled.div `
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: transparent;
    z-index: 97;
`

export const DropDown = ({ handler, children }) => {
	const [isOpen, setIsOpen] = useState(false)

	let DropdownHandler = handler

	const toggleDropDown = () => {
		setIsOpen(!isOpen)
	}

	return (
		<>
            <DropdownOverlay onClick={toggleDropDown} style={{ display: isOpen ? 'block' : 'none' }} />
            <div onClick={toggleDropDown}>
                <DropdownHandler />
                <DropDownWrapper style={{ display: isOpen ? 'block' : 'none' }}>
                    {children}
                </DropDownWrapper>
                <DropDownArrow style={{ display: isOpen ? 'block' : 'none' }} />
            </div>
        </>
	)
}
