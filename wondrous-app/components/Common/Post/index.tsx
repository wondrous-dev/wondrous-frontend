import {
  PostItemBorderDashedFirstChild,
  PostItemBorder,
  PostItemWrapper,
  PostItemBorderDashedCircle,
  PostItemBorderDashedLastChild,
} from './styles';
import { PostType, PostVerbType, ObjectType } from '../../../types/post';
import { PostQuote } from '../PostQuote';

// TODO: determines the post type
const selectPostTypeComponent = (post) => {
  switch (post.type) {
    case PostType.QUOTE:
      return <PostQuote post={post} />;
    default:
      return null;
  }
};

export const Post = (props) => {
  const { post } = props;
  const postTypeComponent = selectPostTypeComponent(post);
  return (
    <PostItemWrapper>
      <PostItemBorderDashedFirstChild />
      <PostItemBorderDashedCircle />
      <PostItemBorderDashedLastChild />
      <PostItemBorder>{postTypeComponent}</PostItemBorder>
    </PostItemWrapper>
  );
};
