import { StyledLink } from './TextLinkStyles';

const TextLink = ({ href, label }) => (
  <StyledLink href={href} target="_blank" rel="noopener noreferrer">
    {href || label}
  </StyledLink>
);

TextLink.propTypes = {};

export default TextLink;
