import { CreateEntityPaymentMethodLabelChain } from 'components/CreateEntity/CreateEntityModal/styles';
import Link from 'next/link';
import styled from 'styled-components';
import palette from 'theme/palette';
import { TaskModalTitle, ViewFieldWrapper } from '../styles';

export const IconWrapper = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${palette.grey900};
  align-items: center;
  justify-content: center;
`;

export const UserChipWrapper = styled(Link)`
  display: flex;
  gap: 6px;
  align-items: center;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    .MuiTypography-root {
      text-decoration-color: ${palette.white};
      text-decoration: underline;
    }
  }
`;

export const TitleIconWrapper = styled(IconWrapper)`
  && {
    background-color: ${palette.grey87};
  }
`;

export const TitleFieldWrapper = styled(ViewFieldWrapper)`
  && {
    width: 100%;
    height: fit-content;
    ${TitleIconWrapper} {
      display: none;
    }
    &:hover {
      background-color: transparent;
      ${TaskModalTitle} {
        color: ${palette.grey250};
      }
      ${TitleIconWrapper} {
        display: flex;
      }
    }
  }
`;

export const DescriptionIconWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  display: none;
`;

export const DescriptionWrapper = styled.div`
  position: relative;
  color: white;
  &:hover {
    cursor: ${({ $canEdit }) => ($canEdit ? 'pointer' : 'default')};
    color: ${({ $canEdit }) => ($canEdit ? palette.grey250 : 'white')};
    ${DescriptionIconWrapper} {
      display: ${({ $canEdit }) => ($canEdit ? 'block' : 'none')};
    }
  }
`;

export const InlineFieldWrapper = styled(ViewFieldWrapper)`
  && {
    padding: 8px;
    &:hover {
      width: fit-content;
    }
  }
`;

export const RewardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    ${CreateEntityPaymentMethodLabelChain} {
      display: none;
    }
  }
`;
