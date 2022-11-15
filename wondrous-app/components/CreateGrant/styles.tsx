import { TaskSectionDisplayContentWrapper } from 'components/Common/TaskViewModal/styles';
import { EditorContainer } from 'components/CreateEntity/CreateEntityModal/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

export const Form = styled.form`
  color: ${palette.white};
`;

export const DisplayWrapper = styled(TaskSectionDisplayContentWrapper)`
  gap: 6px;
  flex-wrap: nowrap;
  .create-entity-date {
    max-width: fit-content;
    .MuiOutlinedInput-root {
      background: ${palette.grey99} !important;
    }
  }
`;

export const RichTextContainer = styled(EditorContainer)`
  && {
    height: 35rem;
  }
`;