import { ClickAwayListener } from '@material-ui/core';
import { delQuery } from '../../../utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ObjectType, PostVerbType } from '../../../types/post';
import * as Constants from '../../../utils/constants';
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

const createHeaderText = (verbOrStatus, objectType, referencedUser, onClick) => {
  const objectTypeHeaderText = objectTypeText[objectType];
  switch (verbOrStatus) {
    case PostVerbType.KUDOS:
      return (
        <>
          awarded a kudos {referencedUser && `to ${referencedUser}`} for a completed{' '}
          <PostHeaderLink onClick={onClick} as="span">
            {objectTypeHeaderText}
          </PostHeaderLink>
        </>
      );
    case Constants.TASK_STATUS_DONE:
      return (
        <>
          completed a{' '}
          <PostHeaderLink onClick={onClick} as="span">
            {objectTypeHeaderText}
          </PostHeaderLink>
        </>
      );
    default:
      return (
        <>
          is doing a{' '}
          <PostHeaderLink onClick={onClick} as="span">
            {objectTypeHeaderText}
          </PostHeaderLink>
        </>
      );
  }
};

export const PostHeader = (props) => {
  const { post } = props;
  const router = useRouter();
  const { id, postId, verb, taskStatus, objectType, content, referencedObject, objectId, actor = {} } = post;
  const postObjectType = objectType ?? referencedObject?.objectType;
  const [menu, setMenu] = useState(null);
  const [kudosForm, setKudosForm] = useState(null);
  const [taskViewModal, setTaskViewModal] = useState(false);
  const loggedInUser = useMe();
  const canEditPost = loggedInUser?.username === actor?.username && verb === PostVerbType.KUDOS;
  const taskId = referencedObject?.objectId ?? objectId;
  const handleMenuOnClose = () => setMenu(null);
  const handleMenuOnClick = (event) => setMenu(menu ? null : event.currentTarget);
  const handlePostEdit = () => {
    handleMenuOnClose();
    setKudosForm(true);
  };
  const handlePostEditClose = () => setKudosForm(false);
  const handleTaskViewModalClose = () => {
    router.replace(`${delQuery(router.asPath)}`, undefined, { shallow: true });
  };
  const handleTaskViewModalOpen = () => {
    router.replace(`${delQuery(router.asPath)}?task=${taskId}`, undefined, { shallow: true });
  };
  const verbOrStatus = verb ?? taskStatus;
  const headerText = createHeaderText(
    verbOrStatus,
    postObjectType,
    referencedObject?.actor?.username,
    handleTaskViewModalOpen
  );

  useEffect(() => {
    if (router?.query?.task) {
      setTaskViewModal(true);
    } else {
      setTaskViewModal(false);
    }
  }, [router?.query?.task]);

  return (
    <>
      <KudosForm open={kudosForm} existingContent={content} onClose={handlePostEditClose} id={postId} />
      <TaskViewModal open={taskViewModal} taskId={taskId} handleClose={handleTaskViewModalClose} />
      <PostHeaderWrapper>
        <PostHeaderImageTextWrapper>
          {actor?.profilePicture ? <PostHeaderImage src={actor?.profilePicture} /> : <PostHeaderDefaultUserImage />}
          <PostHeaderText>
            <PostHeaderUsername as="span">{actor?.username} </PostHeaderUsername>
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
