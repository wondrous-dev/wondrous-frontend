import { PostVerbType } from '../../../types/post';
import {
  PostActivityDefaultUserImage,
  PostActivityHeader,
  PostActivityHeaderImage,
  PostActivityHeaderUsername,
  PostActivityText,
} from './styles';

const createHeaderText = (verb, objectType) => {
  switch (verb) {
    case PostVerbType.KUDOS:
      return `awarded a kudos to for a completed ${objectType}`;
    case PostVerbType.CREATE:
      return `created a ${objectType}`;
    case PostVerbType.COMPLETE:
      return `completed a ${objectType}`;
    default:
      return null;
  }
};

export const PostItemActivityHeader = (props) => {
  const { post } = props;
  const { actorUsername, verb, objectType, actorProfilePicture } = post;
  const headerText = createHeaderText(verb, objectType);
  return (
    <PostActivityHeader>
      {actorProfilePicture ? <PostActivityHeaderImage src={actorProfilePicture} /> : <PostActivityDefaultUserImage />}
      <PostActivityText>
        <PostActivityHeaderUsername as="span">{actorUsername} </PostActivityHeaderUsername>
        {headerText}
      </PostActivityText>
    </PostActivityHeader>
  );
};
