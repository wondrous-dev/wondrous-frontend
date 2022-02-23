import { PostItemActivityHeader } from '../PostItemActivityHeader';
import { PostItemActivityPost } from '../PostItemActivityPost';
import { PostActivityBackground } from './styles';

export const PostItemActivity = (props) => {
  return (
    <PostActivityBackground>
      <PostItemActivityHeader {...props} />
      <PostItemActivityPost {...props} />
    </PostActivityBackground>
  );
};
