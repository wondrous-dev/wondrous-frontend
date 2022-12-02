import { memo } from 'react';
import { Label, ListWrapper } from 'components/Common/SidebarStyles';
import Item from 'components/Common/SidebarItem';

const location = () => {
  if (typeof window !== 'undefined') return window.location.pathname + window.location.search;
  return '';
};

type Props = {
  menuItems: Array<{
    label: string;
    items: Array<any>;
  }>;
  handleOnClick: (link: unknown, entityType: unknown) => void;
  urlPath: string;
};

const SidebarEntityListMemo = ({ menuItems, handleOnClick, urlPath }: Props) => {
  const isActive = (entityType, link) => (entityType ? location().includes(link) : urlPath.includes(link));

  return (
    <ListWrapper>
      {menuItems?.map(({ label, items }) => (
        <ListWrapper key={label}>
          <Label>{label}</Label>
          <ListWrapper>
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
      ))}
    </ListWrapper>
  );
};

export default memo(SidebarEntityListMemo, (prevProps, nextProps) => {
  const areEqual =
    JSON.stringify(prevProps.menuItems) === JSON.stringify(nextProps.menuItems) &&
    prevProps.urlPath === nextProps.urlPath;

  return areEqual;
});
