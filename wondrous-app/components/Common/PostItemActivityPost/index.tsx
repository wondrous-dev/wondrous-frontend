import { PostItemActivityHeader } from '../PostItemActivityHeader';
import {
  PostContentBackground,
  PostContentBorder,
  PostReferenceBackground,
  PostReferenceBorder,
  ReferenceTitle,
  ReferenceDescription,
} from './styles';

export const PostItemActivityPost = (props) => {
  return (
    <>
      <PostContentBorder>
        <PostContentBackground>hello</PostContentBackground>
      </PostContentBorder>
      <PostReferenceBorder>
        <PostReferenceBackground>
          {/* TODO: @juniusfree Pass the reference object to the header */}
          <PostItemActivityHeader {...props} />
          <ReferenceTitle>Task or milestone title</ReferenceTitle>
          <ReferenceDescription>Test description</ReferenceDescription>
        </PostReferenceBackground>
      </PostReferenceBorder>
    </>
  );
};
