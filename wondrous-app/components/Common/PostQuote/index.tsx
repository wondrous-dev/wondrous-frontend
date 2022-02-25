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
  ReferenceMedia,
  ReferenceMediaWrapper,
} from './styles';

export const PostQuote = (props) => {
  const { post } = props;
  const { referencedObject, itemContent } = post;
  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
      <PostQuoteWrapper>
        <PostContentBorder />
        <PostContentBackground>{itemContent}</PostContentBackground>
        <PostReferenceBorder>
          <PostReferenceBackground>
            <PostHeader post={referencedObject} />
            <ReferenceTitle>{referencedObject?.title}</ReferenceTitle>
            <ReferenceDescription>{referencedObject?.itemContent}</ReferenceDescription>
            <ReferenceMediaWrapper>
              {referencedObject?.media &&
                referencedObject?.media
                  .slice(0, 2)
                  .map((_, i) => <ReferenceMedia key={i} media={referencedObject?.media[i]} />)}
            </ReferenceMediaWrapper>
          </PostReferenceBackground>
        </PostReferenceBorder>
      </PostQuoteWrapper>
    </PostQuoteBackground>
  );
};
