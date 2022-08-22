import {
  AddIconWrapper,
  ChildrenWrapper,
  Label,
  ListWrapper,
  SidebarWrapper,
  Wrapper,
} from 'components/Common/Sidebar/Common/styles';
import useSideBar from 'hooks/useSideBar';
import { shuffle } from 'lodash';
import { ColorTypes } from 'utils/constants';
import { useBoards } from 'utils/hooks';

import BackButton from './Common/BackButton';
import { useCanEdit } from './Common/hooks';
import FolderIcon from './Common/icons/folder.svg';
import Item from './Common/Item';

const randomColors = shuffle(Object.values(ColorTypes));

const ResourcesSidebar = ({ children, docs, handleCreateNewCategory, handleSelectCategory, selectedCategory }) => {
  const { minimized } = useSideBar();
  const { board, orgBoard } = useBoards();
  const href = orgBoard ? `/organization/${board?.orgData?.username}/boards` : `/pod/${board?.podId}/boards`;
  const canEdit = useCanEdit();
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
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
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default ResourcesSidebar;
