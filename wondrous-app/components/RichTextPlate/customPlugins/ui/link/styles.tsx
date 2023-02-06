import styled, { css } from 'styled-components';

import palette from 'theme/palette';
import { FloatingLink } from 'components/RichTextPlate/customPlugins/CustomLink';

const floatingLink = css`
  border-style: none;
  background-color: ${palette.grey910};
  height: 2rem;
  flex-grow: 1;
  padding: 0;
  line-height: 20px;
  caret-color: ${palette.white};
  color: ${palette.grey57};
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;

const floatingLinkEdit = css`
  font-family: inherit;
  font-size: 14px;
  border-radius: 3px;
  color: ${palette.grey57};
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 100%;
  border: 0;
  font-weight: 500;
  cursor: pointer;
  background-color: ${palette.grey910};
  padding: 0.25rem 0.5rem;
  &:hover {
    color: ${palette.white};
  }
`;

const floatingLinkRoot = css`
  background-color: ${palette.grey910};
  border: 1px solid ${palette.grey57};
  z-index: 20;
  width: auto;
  border-radius: 4px;
  box-shadow: 12px 10px 24px 2px rgba(16, 16, 16, 0.8);
`;

export const FloatingMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 330px;
  background-color: ${palette.grey910};
  border-radius: 4px;
  border: 1px solid ${palette.grey57};
`;

export const FloatingInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem 0.25rem 0;
`;

export const FloatingIconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: ${palette.grey57};
`;

export const FloatingLinkEditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem;
`;

export const FloatingHorizontalDivider = styled.div`
  height: 1px;
  background-color: ${palette.grey57};
`;

export const FloatingLinkUrlInput = styled(FloatingLink.UrlInput)`
  ${floatingLink}
`;

export const FloatingLinkTextInput = styled(FloatingLink.TextInput)`
  ${floatingLink}
`;

export const FloatingLinkEditButton = styled(FloatingLink.EditButton)`
  ${floatingLinkEdit}
`;

export const FloatingLinkOpenLinkButton = styled(FloatingLink.OpenLinkButton)`
  ${floatingLinkEdit}
`;

export const FloatingLinkUnlinkButton = styled(FloatingLink.UnlinkButton)`
  ${floatingLinkEdit}
`;

export const FloatingLinkInsertRoot = styled(FloatingLink.InsertRoot)`
  ${floatingLinkRoot}
`;

export const FloatingLinkEditRoot = styled(FloatingLink.EditRoot)`
  ${floatingLinkRoot}
`;
