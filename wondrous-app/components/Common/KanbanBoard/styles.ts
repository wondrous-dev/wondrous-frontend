import styled from 'styled-components';
import { CreateLayoutsModal } from '../../CreateEntity/styles';

export const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    min-height: 100vh;
  }
`;

export const LoadMore = styled.div`
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

export const ModalBody = styled(CreateLayoutsModal)`
  && {
    width: auto;
    max-width: 600px;
  }
`;
