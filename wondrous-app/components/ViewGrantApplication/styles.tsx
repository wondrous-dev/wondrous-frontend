import { TaskModalCard, TaskSectionDisplayLabel } from 'components/Common/TaskViewModal/styles';
import { GrantAmountWrapper } from 'components/ViewGrant/Fields/styles';
import styled from 'styled-components';

export const GrantSectionDisplayLabel = styled(TaskSectionDisplayLabel)`
  && {
    min-width: 140px;
  }
`;

export const GrantAmountContainer = styled.div`
  ${GrantAmountWrapper} {
    padding: 8px;
  }
`;

export const ModalCard = styled(TaskModalCard)`
  && {
    height: fit-content;
    min-height: 70vh;
    max-height: 95vh;
  }
`;

export const GrantStatus = styled.div``;
