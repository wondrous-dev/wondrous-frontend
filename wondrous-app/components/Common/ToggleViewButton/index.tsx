import React, { useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip';
import { Badge } from '@mui/material';
import { useHotkey } from 'utils/hooks';
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
}

// Toggler between views (i.e. grid vs list)
export function ToggleViewButton(props: IToggleViewButtonProps) {
  const { options } = props;
  const showBadge = useHotkey();
  const hotkeyLetters = { List: ',', Grid: '.', Calendar: '/' };

  return (
    <ToggleViewWrapper {...props}>
      {options.map((opt, key) => {
        let className = opt.active && !opt?.disabled ? 'active' : '';
        if (opt?.disabled) className = `${className} disabled`;
        return (
          <Badge badgeContent={hotkeyLetters[opt.name]} color="primary" invisible={!showBadge}>
            <Tooltip key={`toggle-option-${opt.name}`} title={`${opt.name} view`} placement="top">
              <ToggleViewOption
                key={`toggle-option-${opt.name}`}
                className={className}
                onClick={() => {
                  opt.action();
                }}
              >
                {opt?.icon ?? opt.name}
              </ToggleViewOption>
            </Tooltip>
          </Badge>
        );
      })}
    </ToggleViewWrapper>
  );
}
