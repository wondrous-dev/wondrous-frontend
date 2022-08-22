import { ChildrenWrapper, Label, ListWrapper, SidebarWrapper, Wrapper } from 'components/Common/Sidebar/Common/styles';
import AddIcon from 'components/Icons/add.svg';
import useSideBar from 'hooks/useSideBar';
import { shuffle } from 'lodash';
import styled from 'styled-components';
import { ColorTypes } from 'utils/constants';
import { useOrgBoard, usePodBoard } from 'utils/hooks';

import BackButton from './Common/BackButton';
import FolderIcon from './Common/icons/folder.svg';
import Item from './Common/Item';

const randomColors = shuffle(Object.values(ColorTypes));

const AddIconWrapper = styled((props) => (
  <div {...props}>
    <div>
      <AddIcon />
    </div>
  </div>
))`
  align-items: center;
  background: linear-gradient(270deg, #00baff -5.62%, #7427ff 45.92%, #ccbbff 103.12%);
  display: flex;
  height: 22px;
  justify-content: center;
  width: 22px;
  border-radius: 50px;
  > div {
    border-radius: 50px;
    align-items: center;
    background: #0f0f0f;
    display: flex;
    height: 21px;
    justify-content: center;
    width: 21px;
  }
`;

const ResourcesSidebar = ({ children, docs, handleCreateNewCategory, handleSelectCategory, selectedCategory }) => {
  const { minimized } = useSideBar();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const href = orgBoard ? `/organization/${board?.orgData?.username}/boards` : `/pod/${board?.podId}/boards`;
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        <BackButton href={href} />
        <ListWrapper>
          <Label>Resources</Label>
          <ListWrapper>
            <Item roundedBg bgColor={randomColors[randomColors.length - 1]} onClick={handleCreateNewCategory}>
              <AddIconWrapper /> New Category
            </Item>
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
