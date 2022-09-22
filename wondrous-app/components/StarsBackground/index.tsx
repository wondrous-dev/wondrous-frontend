import { Wrapper, Stars } from './styles';

const StarsBackground = ({ children, enableStarsBg }) =>
  enableStarsBg ? (
    <Wrapper>
      {Array(5)
        .fill(Stars)
        .map((Star, idx) => (
          <Star key={idx} />
        ))}
      {children}
    </Wrapper>
  ) : (
    children
  );

export default StarsBackground;
