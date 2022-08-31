import {
  AddIconWrapper,
  ChildrenWrapper,
  Label,
  ListWrapper,
  SidebarContent,
  SidebarWrapper,
  Wrapper,
} from 'components/Common/Sidebar/Common/styles';
import BackButton from 'components/Common/SidebarBackButton';
import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import useSideBar from 'hooks/useSideBar';
import { shuffle } from 'lodash';
import { ColorTypes } from 'utils/constants';
import { useBoards } from 'utils/hooks';

import { useCanEdit } from './Common/hooks';
import FolderIcon from './Common/icons/folder.svg';
import Item from './Common/Item';

const randomColors = shuffle(Object.values(ColorTypes));

const ResourcesSidebar = ({ children, docs, handleCreateNewCategory, handleSelectCategory, selectedCategory }) => {
  const { minimized } = useSideBar();
  const { board, orgBoard } = useBoards();
  const href = orgBoard
    ? `/organization/${board?.orgData?.username}/boards?entity=task`
    : `/pod/${board?.podId}/boards?entity=task`;
  const canEdit = useCanEdit();
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        <SidebarContent>
          <BackButton href={href} />
          <ListWrapper>
            <Label>Resources</Label>
            <ListWrapper>
              {canEdit && (
                <Item roundedBg bgColor={randomColors[randomColors.length - 1]} onClick={handleCreateNewCategory}>
                  <AddIconWrapper /> New Category
                </Item>
              )}
              <Item
                Icon={FolderIcon}
                roundedBg
                bgColor={randomColors[randomColors.length - 1]}
                onClick={handleSelectCategory(null)}
                isActive={selectedCategory === null}
              >
                Show all
              </Item>
              {docs?.map(({ name, id }, index) => (
                <Item
                  key={id}
                  Icon={FolderIcon}
                  roundedBg
                  bgColor={randomColors[index]}
                  onClick={handleSelectCategory(id)}
                  isActive={selectedCategory === id}
                >
                  {name}
                </Item>
              ))}
            </ListWrapper>
          </ListWrapper>
        </SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default ResourcesSidebar;
