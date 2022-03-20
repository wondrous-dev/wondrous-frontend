import React, { useEffect, useState } from 'react';
import { ToggleViewWrapper, ToggleViewOption } from './styles';

interface IToggleViewButtonProps {
  options: {
    name: string;
    icon?: JSX.Element;
    active: boolean;
    action: () => void;
  }[];
  style?: React.CSSProperties;
}

// Toggler between views (i.e. grid vs list)
export const ToggleViewButton = (props: IToggleViewButtonProps) => {
  const { options } = props;
  const [active, setActive] = useState(0);

  const activateOption = (index) => {
    setActive(index);
  };

  useEffect(() => {
    // Set active based on input
    options.some((option, index) => {
      if (option.active) {
        setActive(index);

        return true;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToggleViewWrapper {...props}>
      {options.map((opt, key) => (
        <ToggleViewOption
          key={'toggle-option-' + opt.name}
          className={key == active ? 'active' : ''}
          onClick={() => {
            activateOption(key);
            opt.action();
          }}
        >
          {opt?.icon ?? opt.name}
        </ToggleViewOption>
      ))}
    </ToggleViewWrapper>
  );
};
