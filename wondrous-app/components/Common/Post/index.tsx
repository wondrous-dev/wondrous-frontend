import { PostType } from 'types/post';
import { PostQuote } from '../PostQuote';
import {
  PostBorder,
  PostBorderDashedCircle,
  PostBorderDashedFirstChild,
  PostBorderDashedLastChild,
  PostWrapper,
} from './styles';

const selectPostTypeComponent = (post) => {
  switch (post.postType) {
    case PostType.QUOTE:
      return <PostQuote post={post} />;
    default:
      return null;
  }
};

export function Post(props) {
  const { post } = props;
  const postTypeComponent = selectPostTypeComponent(post);
  return (
    <PostWrapper>
      <PostBorderDashedFirstChild />
      <PostBorderDashedCircle />
      <PostBorderDashedLastChild />
      <PostBorder>{postTypeComponent}</PostBorder>
    </PostWrapper>
  );
}
