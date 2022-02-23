import {
  PostItemBorderDashedFirstChild,
  PostItemBorder,
  PostItemWrapper,
  PostItemBorderDashedCircle,
  PostItemBorderDashedLastChild,
} from './styles';
import { PostType, PostVerbType, ObjectType } from '../../../types/post';
import { PostItemActivity } from '../PostItemActivity';

// TODO: determines the post type
const selectPostTypeComponent = (post) => {
  switch (post.type) {
    case PostType.ACTIVITY:
      return <PostItemActivity post={post} />;
    default:
      return null;
  }
};

export const PostItem = (props) => {
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
