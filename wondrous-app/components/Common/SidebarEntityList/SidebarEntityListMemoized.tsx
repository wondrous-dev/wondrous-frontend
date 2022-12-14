import Item from 'components/Common/SidebarItem';
import { Label, ListWrapper } from 'components/Common/SidebarStyles';
import { memo } from 'react';

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
  minimized: boolean;
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
            {label && !minimized ? <Label>{label}</Label> : null}
            <ListWrapper minimized={minimized}>
              {items.map(
                ({
                  text,
                  link,
                  Icon,
                  count,
                  entityType = null,
                  Component = null,
                  ignoreIconStyles = false,
                  customActiveCheck = null,
                }) => {
                  if (Component) return <Component key={text} />;
                  return (
                    !!text && (
                      <Item
                        key={text}
                        onClick={handleOnClick(link, entityType)}
                        Icon={Icon}
                        isActive={customActiveCheck ? customActiveCheck() : isActive(entityType, link)}
                        count={count}
                        ignoreIconStyles={ignoreIconStyles}
                      >
                        {text}
                      </Item>
                    )
                  );
                }
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
    prevProps.urlPath === nextProps.urlPath &&
    prevProps.minimized &&
    nextProps.minimized;

  return areEqual;
});
