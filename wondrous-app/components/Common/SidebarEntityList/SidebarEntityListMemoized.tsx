import { memo } from 'react';
import { Label, ListWrapper } from 'components/Common/SidebarStyles';
import Item from 'components/Common/SidebarItem';

const location = () => {
  if (typeof window !== 'undefined') return window.location.pathname + window.location.search;
  return '';
};

type MenuItem = {
  label?: string;
  items: Array<any>;
} | null;

type Props = {
  menuItems: Array<MenuItem>;
  handleOnClick: (link: unknown, entityType: unknown) => void;
  urlPath: string;
  minimized: boolean
};

const SidebarEntityListMemoized = ({ menuItems, handleOnClick, urlPath, minimized }: Props) => {
  const isActive = (entityType, link) => (entityType ? location().includes(link) : urlPath.includes(link));
  return (
    <ListWrapper>
      {menuItems?.map((menuItem) => {
        if (!menuItem) return null;
        const { label, items } = menuItem;
        return (
          <ListWrapper key={label}>
            {label ? <Label>{label}</Label> : null}
            <ListWrapper minimized={minimized}>
              {items.map(
                ({ text, link, Icon, count, entityType = null }) =>
                  !!text && (
                    <Item
                      key={text}
                      onClick={handleOnClick(link, entityType)}
                      Icon={Icon}
                      isActive={isActive(entityType, link)}
                      count={count}
                    >
                      {text}
                    </Item>
                  )
              )}
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
    prevProps.urlPath === nextProps.urlPath && prevProps.minimized && nextProps.minimized;

  return areEqual;
});
