import styled from 'styled-components';
import { CreateLayoutsModal } from '../../CreateEntity/styles';

export const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: ${({ isMobile }) => (isMobile ? '' : '100vh')};
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 32px;
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
