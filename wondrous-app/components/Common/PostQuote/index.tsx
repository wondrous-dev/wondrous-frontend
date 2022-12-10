import SmartLink from 'components/Common/SmartLink';
import { delQuery } from 'utils/index';
import { useRouter } from 'next/router';
import { RichTextViewer } from 'components/RichText';
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
                onNavigate={() => {
                  const query = {
                    ...router.query,
                    task: taskId,
                  };

                  router.push({ query }, undefined, { scroll: false, shallow: true });
                }}
              >
                {referencedObject?.title}
              </SmartLink>
            </ReferenceTitle>
            <ReferenceDescription as="div">
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
