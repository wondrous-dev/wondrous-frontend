import { PostHeader } from '../PostHeader';
import {
  PostContentBackground,
  PostContentBorder,
  PostQuoteBackground,
  PostQuoteWrapper,
  PostReferenceBackground,
  PostReferenceBorder,
  ReferenceDescription,
  ReferenceTitle,
} from './styles';

export const PostQuote = (props) => {
  const { post } = props;
  const { referencedObject, itemContent } = post;
  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
      <PostQuoteWrapper>
        <PostContentBorder>
          <PostContentBackground>{itemContent}</PostContentBackground>
        </PostContentBorder>
        <PostReferenceBorder>
          <PostReferenceBackground>
            <PostHeader post={referencedObject} />
            <ReferenceTitle>{referencedObject?.title}</ReferenceTitle>
            <ReferenceDescription>{referencedObject?.itemContent}</ReferenceDescription>
            {/* TODO: @juniusfree Add the images here if any */}
          </PostReferenceBackground>
        </PostReferenceBorder>
      </PostQuoteWrapper>
    </PostQuoteBackground>
  );
};
