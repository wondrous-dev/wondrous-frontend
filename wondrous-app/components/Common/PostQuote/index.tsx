import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils/index';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
import { useLocation } from 'utils/useLocation';
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
import { PostHeader } from '../PostHeader';

export function PostQuote(props) {
  const { post } = props;
  const router = useRouter();
  const location = useLocation();
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
              <SmartLink href={taskViewUrl} preventLinkNavigation onNavigate={() => location.replace(taskViewUrl)}>
                <a href={taskViewUrl}>{referencedObject?.title}</a>
              </SmartLink>
            </ReferenceTitle>
            <ReferenceDescription>
              <RichTextViewer text={referencedObject?.content} />
            </ReferenceDescription>
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
}
