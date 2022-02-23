import { PostVerbType } from '../../../types/post';
import {
  PostHeaderDefaultUserImage,
  PostHeaderWrapper,
  PostHeaderImage,
  PostActivityHeaderUsername,
  PostHeaderText,
} from './styles';

const createHeaderText = (verb, objectType) => {
  switch (verb) {
    case PostVerbType.KUDOS:
      return `awarded a kudos to USER for a completed ${objectType}`;
    case PostVerbType.CREATE:
      return `created a ${objectType}`;
    case PostVerbType.COMPLETE:
      return `completed a ${objectType}`;
    default:
      return null;
  }
};

export const PostHeader = (props) => {
  const { post } = props;
  const { actorUsername, verb, objectType, actorProfilePicture } = post;
  const headerText = createHeaderText(verb, objectType);
  return (
    <PostHeaderWrapper>
      {actorProfilePicture ? <PostHeaderImage src={actorProfilePicture} /> : <PostHeaderDefaultUserImage />}
      <PostHeaderText>
        <PostActivityHeaderUsername as="span">{actorUsername} </PostActivityHeaderUsername>
        {headerText}
      </PostHeaderText>
    </PostHeaderWrapper>
  );
};
