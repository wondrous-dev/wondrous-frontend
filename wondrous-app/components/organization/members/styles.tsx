import Link from 'next/link';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from 'components/Icons/search';
import palette from 'theme/palette';

export const MembersWrapper = styled(Grid)`
  && {
    padding: 25px 0;
    width: 95%;
    margin: 0 auto;
  }
`;

export const MembersHeader = styled(Grid)`
  && {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    gap: 18px;
    padding-bottom: 24px;
    border-bottom: 1px solid ${palette.grey900};
  }
`;

export const MembersHeading = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 700;
    font-size: 20px;
    line-height: 18px;
    letter-spacing: 0.03em;
    color: ${palette.white};
  }
`;

export const UserRole = styled(Grid)`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 5px 3px 3px;
    background: ${palette.grey900};
    border: 1px solid ${(props) => props.borderColor};
    border-radius: 1000px;

    div {
      padding: 2px 7px;
    }

    p {
      font-size: 13px;
      font-weight: 500;
    }
  }
`;

export const FilteredRolesContainer = styled(Grid)`
  && {
    display: flex;
    align-items: center;
    gap: 16px;

    p {
      font-size: 13px;
      font-weight: 500;
      text-transform: capitalize;
    }
  }
`;

export const FilterMembersContainer = styled(Grid)`
  && {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 24px 0;
    border-bottom: 1px solid ${palette.grey900};
  }
`;

export const FilterMembersInput = styled.input`
  flex: 1;
  background: ${palette.black101};
  padding: 12px 14px 12px 42px;
  border: 1px solid ${palette.black101};
  border-radius: 1000px;
  outline: none;
  font-family: 'Space Grotesk';
  font-size: 15px;
  font-weight: 400;
  color: ${palette.grey250};
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border: 1px solid ${palette.black81};
  }
`;

export const FilterMembersInputIcon = styled(SearchIcon)`
  && {
    position: absolute;
    top: 50%;
    left: 1em;
    transform: translateY(-50%);
    pointer-events: none;

    path {
      stroke: ${palette.white};
    }
  }
`;

const StyledSelect = styled(Select)`
  && {
    background: ${palette.black101};
    color: ${palette.white};
    height: 45px;
    width: 245px;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: border 0.2s ease-out;

    :hover {
      border: 1px solid ${palette.grey79};
    }

    svg {
      color: ${palette.white};
      transition: transform 0.2s ease-out;
    }

    p {
      margin: 0;
    }
  }
`;

export const RoleFilterSelect = styled(({ className, ...props }) => (
  <StyledSelect {...props} {...className} MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: ${palette.black101};
    border: 1px solid ${palette.grey79};
    width: 245px;
    color: ${palette.white};
  }

  &.MuiPaper-root > .MuiList-root {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 12px;
  }
`;

export const RoleFilterSelectValueDisplay = styled(Grid)`
  display: flex;
  align-items: center;
`;

export const RoleFilterSelectMenuItem = styled(MenuItem)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${palette.black98} !important;
    color: ${palette.white};
    border-radius: 4px;
    padding: 8px;
    transition: background 0.2s ease-out;
    position: relative;

    :hover {
      background: ${palette.black92} !important;
    }

    ::before {
      position: absolute;
      inset: 0;
      content: '';
      display: block;
      padding: 1px;
      background: ${(props) =>
        props.isSelected
          ? `linear-gradient(89.84deg, ${palette.highlightOrange} 5.89%, ${palette.highlightPurple} 90.32%)`
          : 'transparent'};
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
  }
`;

export const RoleFilterSelectMenuIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-color: ${(props) => (props.isSelected ? palette.highlightPurple : palette.grey78)};
  border-radius: 1000px;
  padding: 1px;
`;

export const RequestsContainer = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${palette.grey900};
`;

export const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`;

export const RequestCountWrapper = styled(Typography)`
  && {
    position: relative;
    padding: 7.5px 10px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    line-height: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 1000px;
    color: ${palette.white};

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(251.85deg, ${palette.white} -32.64%, ${palette.red300} 66.55%);
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
  }
`;

export const RequestCount = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 0.03em;
    margin-bottom: 14px;
  }
`;

export const ExistingMembersCount = styled(RequestCount)``;

export const RequestCountEmptyState = styled(RequestCount)`
  && {
    color: ${palette.white};
  }
`;

export const MemberRequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const MemberRequestCard = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Space Grotesk';
  width: 100%;
`;

export const MemberProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
`;

export const MemberName = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 600;
    color: ${palette.white};
  }
`;

export const MemberMessage = styled(MemberName)`
  && {
    font-size: 15px;
    font-weight: 400;
    margin-left: 16px;
    color: ${palette.grey57};
    max-width: 82ch;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const MemberRequestDetails = styled(Grid)`
  && {
    display: flex;
    align-items: center;
    gap: 42px;
    margin-left: auto;
    margin-right: 42px;

    div {
      padding: 2px 7px;

      p {
        font-size: 13px;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
  }
`;

export const MemberRequestDate = styled(MemberName)`
  && {
    font-size: 13px;
    font-weight: 500;
    color: ${palette.grey51};
  }
`;

export const RequestActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RequestActionButton = styled(Button)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    padding: 7px 16px;
    border-radius: 1000px;
    color: ${palette.white};
    &.Mui-disabled {
      color: ${palette.white};
    }
  }
`;

export const RequestDeclineButton = styled(RequestActionButton)`
  && {
    background: ${palette.grey78};
    &:hover {
      background: ${palette.grey78};
    }
  }
`;

export const RequestApproveButton = styled(RequestActionButton)`
  && {
    background: ${palette.background.default};
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
    &:hover {
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
    }
  }
`;

export const RequestRejectButton = styled(RequestApproveButton)`
  && {
    &::before {
      background: linear-gradient(259.59deg, ${palette.red300} 0%, ${palette.highlightPurple} 93.38%);
    }
    &:hover {
      background: linear-gradient(259.59deg, ${palette.red300} 0%, ${palette.highlightPurple} 93.38%);
    }
  }
`;

export const ShowMoreButton = styled(RequestActionButton)`
  && {
    margin-top: 14px;
    background: ${palette.grey87};
    color: ${palette.highlightBlue};
    border-radius: 1000px;
    padding: 9px 14px;

    &:hover {
      background: ${palette.grey87}b3;
    }
  }
`;

export const MembersContainer = styled(RequestsContainer)`
  && {
    border: none;
  }
`;

export const MembersList = styled(MemberRequestsList)``;

export const MemberWalletAddress = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 500;
    color: ${palette.grey51};
  }
`;

export const MemberRow = styled(Grid)`
  && {
    display: flex;
    align-items: center;
  }
`;

export const MemberLink = styled(MemberProfileLink)`
  && {
    gap: 14px;
  }
`;

export const MemberRowLeft = styled(MemberRow)`
  && {
    flex: 1;
    gap: 14px;
  }
`;

export const MemberRowRight = styled(MemberRow)`
  && {
    gap: 42px;
    min-width: 195px;

    div {
      padding: 2px 7px;

      p {
        font-size: 13px;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
  }
`;

export const MemberPodCount = styled(MemberName)`
  && {
    font-size: 13px;
    font-weight: 500;
    line-height: 13px;
    color: ${palette.grey51};
  }
`;

export const MemberRequestsListEndMessage = styled(MemberName)`
  && {
    font-weight: 400;
    color: ${palette.grey57};
    text-align: center;
    padding-top: 14px;
  }
`;

export const EmptyMemberRequestsListMessage = styled(MemberRequestsListEndMessage)``;
