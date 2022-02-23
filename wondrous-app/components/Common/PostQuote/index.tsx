import { PostHeader } from '../PostHeader';
import { PostQuoteKudos } from '../PostQuoteKudos';
import { PostQuoteBackground } from './styles';

export const PostQuote = (props) => {
  return (
    <PostQuoteBackground>
      <PostHeader {...props} />
      <PostQuoteKudos {...props} />
    </PostQuoteBackground>
  );
};
