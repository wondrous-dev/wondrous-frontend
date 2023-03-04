import styled from 'styled-components';
import palette from 'theme/palette';
import Link from 'next/link';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const NotificationsBoardWrapper = styled.div`
  max-height: 60vh;
  overflow: auto;
  ${ScrollBarStyles}
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-height: 100vh;
  }
`;

export const NotificationsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  padding: 15px 0px;
  margin: 0px;

  height: 100%;
  line-height: 20px;

  cursor: pointer;
  pointer-events: ${(props) => (props.emptyNotifications ? 'none' : '')};

  :hover {
    background: ${(props) => (props.isNotificationViewed ? palette.black92 : palette.black97)};
  }
  background: ${(props) =>
    props.isNotificationViewed || props.emptyNotifications ? palette.black97 : palette.black92};
`;

export const NotificationItemIcon = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
  justify-content: center;
  height: 50px;
  width: 27px;
  margin: 0px 15px;
`;

export const NotificationItemStatus = styled.div`
  position: absolute;
  top: 12px;
  right: 0;
  width: 10px;
  height: 10px;
  z-index: 103;
`;

export const NotificationItemBody = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: ${(props) => (props.emptyNotifications ? 'center' : 'flex-start')};
  color: ${palette.white};
`;

export const NotificationItemTimeline = styled.span`
  padding: 2px 0px 0px 4px;
  color: ${palette.black30};
  line-height: 14px;
  font-weight: 300;
`;

export const NotificationsBoardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  top: 100%;
  width: 100%;
  padding: 15px;

  height: 50px;
  line-height: 46px;

  background: ${palette.black92};
  border-bottom: 1px solid black;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

export const NotificationsMarkRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  line-height: 32px;
  cursor: pointer;
  ${(props) =>
    props.enabled
      ? `
        color: #d0b9ff;
        text-decoration: underline;
        font-weight: 500;
        `
      : `
        color: ${palette.grey75};
        text-decoration: none;
        pointer-events: none;
        `}
`;

export const NotificationsLink = styled.span`
  a {
    color: ${palette.highlightBlue};
    font-weight: 700;
    text-decoration: none;
    display: inline-block;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NotificationItemInner = styled.div`
  padding-top: 2px;
  color: ${palette.white};
`;

export const NotificationWrapper = styled.div`
  width: 75%;
`;

export const NotificationsContentPreview = styled.div`
  color: ${palette.grey40};
  margin-top: 7px;
`;

export const NotificationsDot = styled.span`
  height: 8px;
  width: 8px;
  background: linear-gradient(196.76deg, #ffffff -48.71%, #f93701 90.48%);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0px 0px 2px white;
`;

export const NotificationsTitle = styled.h3``;
