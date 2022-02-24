import { PostHeader } from '../PostHeader';
import { PostQuoteKudos } from '../PostQuoteKudos';
import {
  PostQuoteBackground,
  PostContentBackground,
  PostContentBorder,
  PostReferenceBackground,
  PostReferenceBorder,
  ReferenceTitle,
  ReferenceDescription,
} from './styles';

export const PostQuote = (props) => {
  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
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
    </PostQuoteBackground>
  );
};
