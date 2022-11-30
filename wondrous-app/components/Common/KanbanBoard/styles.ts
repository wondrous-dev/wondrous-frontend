import styled from 'styled-components';
import { CreateLayoutsModal } from '../../CreateEntity/styles';

export const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 32px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 150px;
    display: block;
    /* width: 400%; */
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
