import Item from 'components/Common/SidebarItem';
import { Label, ListWrapper } from 'components/Common/SidebarStyles';
import React, { memo } from 'react';

const location = () => {
  if (typeof window !== 'undefined') return window.location.pathname + window.location.search;
  return '';
};

type MenuItem = {
  [key: string]: {
    label: string;
    items: {
      [key: string]: {
        text: string;
        link: string;
        Icon?: React.ReactNode | React.FC | JSX.Element;
        Component?: React.FC;
        check?: () => boolean;
        count?: number;
        ignoreIconStyles?: boolean;
        active?: boolean;
        entityType?: string;
      };
    };
  };
};

type Props = {
  menuItems: MenuItem;
  handleOnClick: (link: unknown, entityType: unknown) => void;
  urlPath: string;
  minimized: boolean;
};

const SidebarEntityListMemoized = ({ menuItems, handleOnClick, urlPath, minimized }: Props) => {
  const isActive = (entityType, link) => (entityType ? location().includes(link) : urlPath.includes(link));
  return (
    <ListWrapper>
      {Object.keys(menuItems).map((menuItem) => {
        const { label, items } = menuItems[menuItem];
        return (
          <ListWrapper key={label}>
            {label ? <Label minimized={minimized}>{label}</Label> : null}
            <ListWrapper minimized={minimized}>
              {Object.keys(items).map((item) => {
                const { text, link, Icon, Component, check, count, ignoreIconStyles, active, entityType } = items[item];
                if (!active) return null;
                if (Component) return <Component key={text} />;
                return (
                  !!text && (
                    <Item
                      key={text}
                      onClick={handleOnClick(link, entityType)}
                      Icon={Icon}
                      isActive={check ? check() : isActive(entityType, link)}
                      count={count}
                      ignoreIconStyles={ignoreIconStyles}
                      text={text}
                    >
                      {text}
                    </Item>
                  )
                );
              })}
            </ListWrapper>
          </ListWrapper>
        );
      })}
    </ListWrapper>
  );
};

export default memo(SidebarEntityListMemoized, (prevProps, nextProps) => {
  const areEqual =
    JSON.stringify(prevProps.menuItems) === JSON.stringify(nextProps.menuItems) &&
    prevProps.urlPath === nextProps.urlPath &&
    prevProps.minimized &&
    nextProps.minimized;

  return areEqual;
});
