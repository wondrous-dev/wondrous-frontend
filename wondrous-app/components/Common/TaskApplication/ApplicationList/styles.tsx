import styled from 'styled-components';
import { Typography } from '@mui/material';
import { FilterBox } from 'components/Common/Filter/styles';

export const CardWrapper = styled.div`
  background: #1d1d1d;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 18px;
  padding: 14px;
  gap: 14px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    border: 1px solid #424242;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CardStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 11px 7px 3px;
  gap: 5px;
  background: rgba(121, 121, 121, 0.2);
  border-radius: 300px;
  height: 28px;
`;

export const CardBody = styled.div`
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    justify-content: space-between;
    border-top: 0.5px solid #343434;
    padding-top: 10px;
  }
`;

export const CardHeaderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const CardUsername = styled.div`
  color: white;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
`;

export const CardTimestamp = styled.div`
  color: rgba(122, 122, 122, 1);
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 19px;
`;

export const ApplicationStatus = styled.span`
  background: ${({ gradient }) => gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  text-align: center;
`;

export const ApplicationMessage = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 24px;
    color: #ffffff;
  }
`;

export const LinksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
`;

export const LinkContainer = styled.a`
  display: flex;
  gap: 6px;
  width: max-content;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  align-items: center;
  color: #00baff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const RejectButton = styled.button`
  padding: 1px;
  background: #474747;
  border-radius: 234px;
  min-height: 32px;
  text-align: center;
  border: 0px;
  color: white;
  height: auto;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* identical to box height, or 100% */

  color: #ffffff;

  > span {
    background: #474747;
    width: 100%;
    height: 30px;
    border-radius: 234px;
    line-height: 15px;
    padding: 7px 16px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    background: linear-gradient(94.19deg, #f93701 10.13%, #7427ff 131.81%);
    height: 42px;
    flex: 1.25;
    width: 100%;

    > span {
      background: #0f0f0f;
      height: 40px;
      line-height: 25px;
    }
  }
`;

export const LoadMore = styled.div`
  height: 50px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

export const FiltersWrapper = styled.div`
  width: fit-content;
  padding-bottom: 12px;
  align-self: baseline;
  ${FilterBox} {
    left: 0;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  border-radius: 8px;
`;

export const ItemsWrapper = styled.div`
  width: 100%;
`;

export const EmptyStateWrapper = styled.div`
  padding: 14px;
  height: 68px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: linear-gradient(94.19deg, #7427ff 10.13%, #232323 131.81%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;

export const EmptyStateText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 24px;
    letter-spacing: 0.01em;

    color: #c4c4c4;
  }
`;
