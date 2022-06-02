import styled from 'styled-components';
import { white, midnight, highlightPurple, highlightBlue, background } from 'theme/colors';
import { createSpacingUnit } from 'utils';
import { Discord } from '../../../Icons/discord';
import { Twitter } from '../../../Icons/twitter';

export const MainWrapper = styled.main`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 100vh;

  @supports (width: calc(2px - 1px)) {
    /* Viewheight - Footer Height */
    min-height: calc(100vh - 160px);
  }

  color: ${white};
  background: ${background};

  overflow-x: hidden;
  overflow-y: auto;
`;

export const Main = ({ children }) => {
  return (
    <MainWrapper>
      {children}
      {/* TODO: Space Bubbles */}
    </MainWrapper>
  );
};

export const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`;

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 160px;
  width: 100%;

  background: ${midnight};
`;

const FooterContactEmail = styled.a`
  color: ${highlightBlue};
  text-decoration: underline;
  margin-bottom: ${createSpacingUnit(1)};
`;

const socialLinkAttrs = (props) => ({
  target: props.target || '_blank',
  rel: props.rel || 'noreferrer',
});

const FooterSocialLink = styled.a.attrs(socialLinkAttrs)`
  color: ${highlightPurple};

  & > svg {
    height: ${createSpacingUnit(4)};
  }
`;

const FooterSocialLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > ${FooterSocialLink} {
    &:not(:last-child) {
      margin-right: ${createSpacingUnit(2)};
    }
  }
`;

const FooterCopy = styled.p`
  color: #c4c4c4;

  margin: 0;
  margin-top: ${createSpacingUnit(2)};
`;

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContactEmail href="mailto:hello@wonderverse.xyz">hello@wonderverse.xyz</FooterContactEmail>

      <FooterSocialLinks>
        <FooterSocialLink href="https://twitter.com/wonderverse_xyz">
          <Twitter />
        </FooterSocialLink>
        <FooterSocialLink href="https://discord.gg/vUnfjnZADH">
          <Discord />
        </FooterSocialLink>
      </FooterSocialLinks>
      <FooterCopy>&copy; {year} Wonder</FooterCopy>
    </FooterWrapper>
  );
};
