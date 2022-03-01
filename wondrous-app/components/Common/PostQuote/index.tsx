import { PostHeader } from '../PostHeader';
import {
  PostContentBackground,
  PostContentBorder,
  PostQuoteBackground,
  PostQuoteWrapper,
  PostReferenceBackground,
  PostReferenceBorder,
  ReferenceDescription,
  ReferenceMedia,
  ReferenceMediaWrapper,
  ReferenceTitle,
} from './styles';

export const PostQuote = (props) => {
  const { post } = props;
  const { referencedObject, content } = post;
  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
      <PostQuoteWrapper>
        <PostContentBorder />
        <PostContentBackground>{content}</PostContentBackground>
        <PostReferenceBorder>
          <PostReferenceBackground>
            <PostHeader post={referencedObject} />
            <ReferenceTitle>{referencedObject?.title}</ReferenceTitle>
            <ReferenceDescription>{referencedObject?.content}</ReferenceDescription>
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
