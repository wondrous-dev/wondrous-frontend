import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useOutsideAlerter } from 'utils/hooks';
import { GradientMidnightDiagonalOposite, GradientMidnightVertical } from './gradients';

const DropDownWrapper = styled.div`
  position: absolute;
  min-width: 185px;
  min-height: 30px;
  padding: 4px 2px;
  margin-left: -145px;
  margin-top: 9px;
  width: fit-content;
  background: #1d1d1d;
  border: 1px solid #4b4b4b;
  border-radius: 6px;
  transition: 0.2s display;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding-top: 10px;
  padding-bottom: 10px;
  transform: translateY(100%);
`;

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
`;

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
  ${(props) => (props.textAlign ? { textAlign: props.textAlign } : null)};

  cursor: pointer;

  :hover {
    background: #121212;
    border-radius: 4px;
  }
`;

export const DropdownOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  z-index: 97;
`;

export function DropDown(props) {
  const { DropdownHandler, children, divStyle, dropDownStyle = {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const DropdownWrapperRef = useRef(null);

  useOutsideAlerter(DropdownWrapperRef, () => setIsOpen(false));

  const toggleDropDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const display = isOpen ? 'block' : 'none';

  return (
    <>
      <DropdownOverlay onClick={toggleDropDown} style={{ display }} />
      <div onClick={toggleDropDown} style={divStyle}>
        <DropdownHandler {...props} isOpen={isOpen} />
        <DropDownWrapper ref={DropdownWrapperRef} style={{ ...dropDownStyle, display }}>
          {children}
        </DropDownWrapper>
        {/* <DropDownArrow style={{ display: display }} /> */}
      </div>
    </>
  );
}
