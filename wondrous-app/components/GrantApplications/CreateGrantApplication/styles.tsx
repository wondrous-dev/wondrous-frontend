import { TaskModalHeaderTypography } from 'components/Common/TaskViewModal/styles';
import { RequestApproveButton } from 'components/Members/styles';
import {
  CreateEntityHeader,
  CreateEntitySelectWrapper,
  EditorContainer,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { OrgSearchButton } from 'components/OrgSearch/styles';
import styled from 'styled-components';
import palette from 'theme/palette';

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

export const CreateGrantApplicationWorkspaceWrapper = styled(CreateEntitySelectWrapper)`
  && {
    ${OrgSearchButton} {
      min-height: 32px;
      height: 32px;
      background: ${palette.grey99};
    }
  }
`;
