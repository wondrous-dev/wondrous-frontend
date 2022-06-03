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
import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils/index';
import { useRouter } from 'next/router';

export const PostQuote = (props) => {
  const { post } = props;
  const router = useRouter();
  const { referencedObject, content } = post;
  const taskId = referencedObject?.objectId;
  const taskViewUrl = `${delQuery(router.asPath)}?task=${taskId}`;

  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
      <PostQuoteWrapper>
        <PostContentBorder />
        <PostContentBackground>{content}</PostContentBackground>
        <PostReferenceBorder>
          <PostReferenceBackground>
            <PostHeader post={referencedObject} />
            <ReferenceTitle>
              <SmartLink
                href={taskViewUrl}
                preventLinkNavigation
                onNavigate={() => router.replace(taskViewUrl, undefined, { shallow: true })}
              >
                <a href={taskViewUrl}>{referencedObject?.title}</a>
              </SmartLink>
            </ReferenceTitle>
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
