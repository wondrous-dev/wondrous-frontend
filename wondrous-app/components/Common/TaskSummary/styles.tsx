import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import SmartLink from 'components/Common/SmartLink';
import { CreateFormButtonsBlock } from '../../CreateEntity/styles';
import { SafeImage } from '../Image';

export const TaskSummaryWrapper = styled(SmartLink)`
  display: flex;
  margin: 1em auto;
  align-self: center;

  padding: 1px;
  background: #515151;

  background: ${palette.background.default};

  border-radius: 6px;

  min-width: 296px;
  min-height: 170px;
  width: 296px;
  overflow: hidden;
  color: ${palette.grey250};
`;

export const TaskSummaryInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-flow: column wrap;
  align-items: stretch;

  border-radius: 5px;
  padding: 14px;

  padding-bottom: 18px;
  width: 100%;
`;

export const TaskSummaryMedia = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 29px;
  height: 29px;

  border-radius: 3px;
  margin-right: 12px;

  background-color: ${palette.blue800};
`;

export const TaskSummaryFooter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 42px;
  color: #00baff;
  cursor: pointer;
`;

export const TaskSummaryAction = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  cursor: pointer;

  font-size: 16px;
  color: ${palette.violet300};
`;

export function OrgProfilePicture(props) {
  return (
    <SafeImage
      src={props?.src}
      useNextImage={false}
      style={{
        width: '29px',
        height: '28px',
        borderRadius: '4px',
        marginRight: '16px',
      }}
    />
  );
}

export const SmallerCardActionButtons = styled(CreateFormButtonsBlock)`
  && {
    margin-left: 8px;
    padding: 8px;
    border: 1px solid #c4c4c4;
    border-radius: 20px;
    width: max-content;
    cursor: pointer;
  }
`;
