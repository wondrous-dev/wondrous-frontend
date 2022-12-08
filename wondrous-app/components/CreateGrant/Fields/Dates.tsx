import React from 'react';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityLabelWrapper,
  CreateEntityLabel,
  CreateEntityDueDate,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { DisplayWrapper } from '../styles';
import { DueDateWrapper } from './styles';

export default function Dates({ startDate, endDate, onChange }) {
  return (
    <TaskSectionDisplayDiv alignItems="start">
      <CreateEntityLabelWrapper>
        <CreateEntityLabel>Dates</CreateEntityLabel>
      </CreateEntityLabelWrapper>
      <DisplayWrapper>
        <DueDateWrapper>
          <CreateEntityDueDate
            autoFocus={false}
            className="create-entity-date"
            setValue={(date) => {
              onChange('startDate', date);
            }}
            hideRecurring
            placement="bottom"
            handleClose={() => {
              onChange('startDate', null);
            }}
            value={startDate}
          />
        </DueDateWrapper>

        <DueDateWrapper>
          <CreateEntityDueDate
            className="create-entity-date"
            autoFocus={false}
            setValue={(date) => onChange('endDate', date)}
            hideRecurring
            placement="bottom"
            handleClose={() => {
              onChange('endDate', null);
            }}
            value={endDate}
          />
        </DueDateWrapper>
      </DisplayWrapper>
    </TaskSectionDisplayDiv>
  );
}
