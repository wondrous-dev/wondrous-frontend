import { TaskSectionDisplayLabel } from 'components/Common/TaskViewModal/styles';
import GrantIcon from 'components/Icons/GrantIcon';
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
