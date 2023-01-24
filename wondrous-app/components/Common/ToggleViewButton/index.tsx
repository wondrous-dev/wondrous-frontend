import React, { useContext, useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip';
import SecondArrowDropdown from 'components/Icons/SecondArrowDropdown';
import { IsMobileContext } from 'utils/contexts';
import {
  ToggleViewWrapper,
  ToggleViewOption,
  DropdownWrapper,
  DropdownHeaderWrapper,
  DropdownHeader,
  ButtonArrow,
  DropdownMenu,
} from './styles';

interface IToggleViewButtonProps {
  options: {
    name: string;
    icon?: JSX.Element;
    active: boolean;
    action: () => void;
    disabled?: boolean;
  }[];
  style?: React.CSSProperties;
}

// Toggler between views (i.e. grid vs list)
function ToggleViewButton(props: IToggleViewButtonProps) {
  const { options } = props;

  const isMobile = useContext(IsMobileContext);

  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);

  const optionsItems = options.map((opt) => {
    let className = opt.active && !opt?.disabled ? 'active' : '';
    if (opt?.disabled) className = `${className} disabled`;
    return (
      <Tooltip key={`toggle-option-${opt.name}`} title={`${opt.name} view`} placement="top">
        <ToggleViewOption
          key={`toggle-option-${opt.name}`}
          className={className}
          onClick={() => {
            opt.action();
            setIsOpen(false);
          }}
        >
          {opt?.icon ?? opt.name}
        </ToggleViewOption>
      </Tooltip>
    );
  });

  return (
    <>
      {isMobile ? (
        <DropdownWrapper>
          <DropdownHeaderWrapper onClick={toggling}>
            <DropdownHeader>
              {options.find((opt) => opt.active)?.icon ?? options.find((opt) => opt.active)?.name}
            </DropdownHeader>
            <ButtonArrow isOpen={isOpen}>
              <SecondArrowDropdown />
            </ButtonArrow>
          </DropdownHeaderWrapper>
          {isOpen ? <DropdownMenu>{optionsItems}</DropdownMenu> : null}
        </DropdownWrapper>
      ) : (
        <ToggleViewWrapper {...props}>{optionsItems}</ToggleViewWrapper>
      )}
    </>
  );
}

export default ToggleViewButton;
