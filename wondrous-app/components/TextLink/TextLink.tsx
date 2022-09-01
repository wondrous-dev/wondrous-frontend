import { StyledLink } from './TextLinkStyles';

function TextLink({ href, label }) {
  return (
    <StyledLink href={href} target="_blank" rel="noopener noreferrer">
      {href || label}
    </StyledLink>
  );
}

export default TextLink;
