import { ClickAwayListener } from '@material-ui/core';
import { useState } from 'react';
import { ObjectType, PostVerbType } from '../../../types/post';
import { useMe } from '../../Auth/withAuth';
import { KudosForm } from '../KudosForm';
import { TaskViewModal } from '../Task/modal';
import {
  PostHeaderDefaultUserImage,
  PostHeaderImage,
  PostHeaderImageTextWrapper,
  PostHeaderLink,
  PostHeaderMenu,
  PostHeaderMenuItem,
  PostHeaderMore,
  PostHeaderMoreMenuWrapper,
  PostHeaderText,
  PostHeaderUsername,
  PostHeaderWrapper,
} from './styles';

const objectTypeText = {
  [ObjectType.TASK_SUBMISSION]: 'task',
  [ObjectType.TASK]: 'task',
};

const createHeaderText = (verb, objectType, referencedUser, onClick) => {
  const objectTypeHeaderText = objectTypeText[objectType];
  switch (verb) {
    case PostVerbType.KUDOS:
      return (
        <>
          awarded a kudos to {referencedUser} for a completed{' '}
          <PostHeaderLink onClick={onClick} as="span">
            {objectTypeHeaderText}
          </PostHeaderLink>
        </>
      );
    case PostVerbType.COMPLETE:
      return (
        <>
          completed a{' '}
          <PostHeaderLink onClick={onClick} as="span">
            {objectTypeHeaderText}
          </PostHeaderLink>
        </>
      );
    default:
      return null;
  }
};

export const PostHeader = (props) => {
  const { post } = props;
  const {
    id,
    sourceId,
    actorUsername,
    verb,
    objectType,
    actorProfilePicture,
    itemContent,
    referencedObject,
    objectId,
  } = post;
  const [menu, setMenu] = useState(null);
  const [kudosForm, setKudosForm] = useState(null);
  const [taskViewModal, setTaskViewModal] = useState(false);
  const loggedInUser = useMe();
  const canEditPost = loggedInUser?.username === actorUsername && verb === PostVerbType.KUDOS;
  const taskId = referencedObject?.objectId ?? objectId;
  const handleMenuOnClose = () => setMenu(null);
  const handleMenuOnClick = (event) => setMenu(menu ? null : event.currentTarget);
  const handlePostEdit = () => {
    handleMenuOnClose();
    setKudosForm(true);
  };
  const handlePostEditClose = () => setKudosForm(false);
  const handleTaskViewModalClose = () => {
    setTaskViewModal(false);
  };
  const handleTaskViewModalOpen = () => {
    setTaskViewModal(true);
  };
  const headerText = createHeaderText(verb, objectType, referencedObject?.actorUsername, handleTaskViewModalOpen);
  return (
    <>
      <KudosForm open={kudosForm} existingContent={itemContent} onClose={handlePostEditClose} id={sourceId} />
      {taskId && <TaskViewModal open={taskViewModal} taskId={taskId} handleClose={handleTaskViewModalClose} />}
      <PostHeaderWrapper>
        <PostHeaderImageTextWrapper>
          {actorProfilePicture ? <PostHeaderImage src={actorProfilePicture} /> : <PostHeaderDefaultUserImage />}
          <PostHeaderText>
            <PostHeaderUsername as="span">{actorUsername} </PostHeaderUsername>
            {headerText}
          </PostHeaderText>
        </PostHeaderImageTextWrapper>
        {canEditPost && (
          <ClickAwayListener onClickAway={handleMenuOnClose}>
            <PostHeaderMoreMenuWrapper>
              <PostHeaderMore aria-describedby={id} type="button" onClick={handleMenuOnClick} />
              <PostHeaderMenu disablePortal={true} id={id} open={menu} anchorEl={menu} placement="bottom-end">
                <PostHeaderMenuItem onClick={handlePostEdit}>Edit Kudos</PostHeaderMenuItem>
              </PostHeaderMenu>
            </PostHeaderMoreMenuWrapper>
          </ClickAwayListener>
        )}
      </PostHeaderWrapper>
    </>
  );
};
