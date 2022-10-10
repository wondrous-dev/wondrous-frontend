import React, { useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip';
import { ToggleViewWrapper, ToggleViewOption } from './styles';

interface IToggleViewButtonProps {
  options: {
    name: string;
    icon?: JSX.Element;
    active: boolean;
    action: () => void;
    disabled?: boolean;
  }[];
  style?: React.CSSProperties;
  showNewDesign?: boolean; // remove this from the prop and styles when the new design is to be used at all the places
}

// Toggler between views (i.e. grid vs list)
function ToggleViewButton(props: IToggleViewButtonProps) {
  const { options, showNewDesign = false } = props;

  return (
    <ToggleViewWrapper {...props}>
      {options.map((opt, key) => {
        let className = opt.active && !opt?.disabled ? 'active' : '';
        if (opt?.disabled) className = `${className} disabled`;
        return (
          <Tooltip key={`toggle-option-${opt.name}`} title={`${opt.name} view`} placement="top">
            <ToggleViewOption
              showNewDesign={showNewDesign}
              key={`toggle-option-${opt.name}`}
              className={className}
              onClick={() => {
                opt.action();
              }}
            >
              {opt?.icon ?? opt.name}
            </ToggleViewOption>
          </Tooltip>
        );
      })}
    </ToggleViewWrapper>
  );
}

export default ToggleViewButton;
