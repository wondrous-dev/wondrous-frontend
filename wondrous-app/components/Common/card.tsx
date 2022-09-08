import styled from 'styled-components';
import { createSpacingUnit } from 'utils';

export const BaseCardWrapper = styled.header.attrs({
  id: 'modal-scrolling-container', // this is needed for the modal to be able to attach floating elements inside it
})`
  display: flex;
  flex-direction: column;

  padding: 1px;
  background: rgb(35, 35, 35);
  background: linear-gradient(0deg, rgba(35, 35, 35, 1) 0%, rgba(75, 75, 75, 1) 100%);
  border-radius: 6px;
`;

const BaseCardInner = styled.div`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 100%;

  color: #ffffff;
  padding: ${createSpacingUnit(4)};
  background: rgb(20, 20, 20);
  background: linear-gradient(0deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%);
  border-radius: 6px;

  & > *:not(:last-child) {
    margin-bottom: ${createSpacingUnit(2)};
  }
`;

export function BaseCard({ className, children }) {
  return (
    <BaseCardWrapper className={className} data-cy="modal-base">
      <BaseCardInner>{children}</BaseCardInner>
    </BaseCardWrapper>
  );
}
