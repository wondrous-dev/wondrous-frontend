import { ClickAwayListener } from '@material-ui/core';
import { useState } from 'react';
import { ObjectType, PostVerbType } from '../../../types/post';
import { useMe } from '../../Auth/withAuth';
import { KudosForm } from '../KudosForm';
import {
  PostHeaderDefaultUserImage,
  PostHeaderImage,
  PostHeaderImageTextWrapper,
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

const createHeaderText = (verb, object, referencedUser) => {
  const objectType = objectTypeText[object];
  switch (verb) {
    case PostVerbType.KUDOS:
      return `awarded a kudos to ${referencedUser} for a completed ${objectType}.`;
    case PostVerbType.CREATE:
      return `created a ${objectType}.`;
    case PostVerbType.COMPLETE:
      return `completed a ${objectType}.`;
    default:
      return null;
  }
};

export const PostHeader = (props) => {
  const { post } = props;
  const { id, sourceId, actorUsername, verb, objectType, actorProfilePicture, itemContent, referencedObject } = post;
  const [menu, setMenu] = useState(null);
  const [kudosForm, setKudosForm] = useState(null);
  const loggedInUser = useMe();
  const canEditPost = loggedInUser?.username === actorUsername && verb === PostVerbType.KUDOS;
  const headerText = createHeaderText(verb, objectType, referencedObject?.actorUsername);
  const handleMenuOnClose = () => setMenu(null);
  const handleMenuOnClick = (event) => setMenu(menu ? null : event.currentTarget);
  const handlePostEdit = () => {
    handleMenuOnClose();
    setKudosForm(true);
  };
  const handlePostEditClose = () => setKudosForm(false);
  return (
    <>
      <KudosForm open={kudosForm} existingContent={itemContent} onClose={handlePostEditClose} id={sourceId} />
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
