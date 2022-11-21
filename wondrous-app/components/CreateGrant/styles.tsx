import {
  TaskModalTaskDataMinimized,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayContentWrapper,
} from 'components/Common/TaskViewModal/styles';
import { CreateEntityLabelSelectWrapper, EditorContainer } from 'components/CreateEntity/CreateEntityModal/styles';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';

export const Form = styled.form`
  color: ${palette.white};
`;

export const DisplayWrapper = styled(TaskSectionDisplayContentWrapper)`
  gap: 6px;
  flex-wrap: nowrap;
  .create-entity-date {
    z-index: auto !important;
    max-width: fit-content;
    .MuiOutlinedInput-root {
      background: ${palette.grey99} !important;
    }
  }
`;

export const RichTextContainer = styled(EditorContainer)`
  && {
    height: 100%;
  }
`;

export const GrantDescriptionMedia = styled(TaskModalTitleDescriptionMedia)`
  && {
    grid-row-end: span 2;
    grid-row-start: 1;
  }
`;

export const FullScreen = css`
  display: grid;
  grid-template-columns: minmax(0, 6fr) 4fr;
  grid-template-rows: auto 1fr;
  max-height: 100%;
  row-gap: 36px;
  overflow: hidden;
`;

export const GrantModalData = styled.div`
  flex-grow: 1;
  ${({ fullScreen }) => (fullScreen ? FullScreen : TaskModalTaskDataMinimized)};
`;

export const RichTextWrapper = styled.div`
  height: 90%;
  overflow: hidden;
`;

export const GrantSectionDisplayDivWrapper = styled.div`
  margin-top: 18px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  ${({ fullScreen }) =>
    fullScreen &&
    `
    background: #171717;
    grid-column-start: 2;
    grid-row-start: 1;
    grid-row-end: 4;
    padding-top: 24px;
    gap: 24px;
    margin-top: 0;
  `}
`;

export const MediaWrapper = styled(CreateEntityLabelSelectWrapper)`
  && {
    padding-left: 24px;
    padding-bottom: 24px;
    z-index: 100;
    padding-top: 10px;
    background: ${palette.grey900};
  }
`;
