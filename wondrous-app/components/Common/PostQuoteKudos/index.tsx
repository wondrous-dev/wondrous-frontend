import { PostHeader } from '../PostHeader';
import {
  PostContentBackground,
  PostContentBorder,
  PostReferenceBackground,
  PostReferenceBorder,
  ReferenceTitle,
  ReferenceDescription,
} from './styles';

export const PostQuoteKudos = (props) => {
  return (
    <>
      <PostContentBorder>
        <PostContentBackground>hello</PostContentBackground>
      </PostContentBorder>
      <PostReferenceBorder>
        <PostReferenceBackground>
          {/* TODO: @juniusfree Pass the reference object to the header */}
          <PostHeader {...props} />
          <ReferenceTitle>Task or milestone title</ReferenceTitle>
          <ReferenceDescription>Test description</ReferenceDescription>
          {/* TODO: @juniusfree Add the images here if any */}
        </PostReferenceBackground>
      </PostReferenceBorder>
    </>
  );
};
