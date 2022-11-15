import styled from 'styled-components';
import { TaskModalHeaderTypography } from 'components/Common/TaskViewModal/styles';
import { CreateEntityHeader } from 'components/CreateEntity/CreateEntityModal/styles';
import { RequestApproveButton } from 'components/organization/members/styles';
import palette from 'theme/palette';
import { EditorContainer } from 'components/CreateEntity/CreateEntityModal/styles';

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: ${palette.grey95};
  padding: 8px;
`;

export const HeaderTypography = styled(TaskModalHeaderTypography)`
  && {
    cursor: pointer;
  }
`;

export const ActionButton = styled(RequestApproveButton)`
  && {
    height: 32px;
  }
`;

export const FooterButtonsWrapper = styled(CreateEntityHeader)`
  && {
    justify-content: flex-end;
  }
`;

export const RichTextContainer = styled(EditorContainer)`
  &&{
    height: 45rem;
  }
`;