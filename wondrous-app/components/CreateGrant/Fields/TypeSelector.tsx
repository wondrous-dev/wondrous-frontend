import React from 'react';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import { CreateEntityLabelWrapper, CreateEntityLabel } from 'components/CreateEntity/CreateEntityModal/styles';
import { TypeSelectorButton, TypeSelectorWrapper } from './styles';

interface Props {
  config: {
    name: string;
    value: string;
  }[];
  onChange: (value: string) => void;
  value: string;
  label: string;
}

const TypeItem: React.FC<{
  isActive: boolean;
  label: string;
  onChange: () => void;
}> = ({ isActive, label, onChange }) => (
  <TypeSelectorButton type="button" isActive={isActive} onClick={onChange}>
    {label}
  </TypeSelectorButton>
);

const TypeSelector: React.FC<Props> = ({ config, onChange, value, label }) => (
  <TaskSectionDisplayDiv alignItems="start">
   {label ?  <CreateEntityLabelWrapper>
      <CreateEntityLabel>{label}</CreateEntityLabel>
    </CreateEntityLabelWrapper> : null}
    <TypeSelectorWrapper>
      {config.map((field) => (
        <TypeItem
          key={field.value}
          isActive={value === field.value}
          label={field.name}
          onChange={() => onChange(field.value)}
        />
      ))}
    </TypeSelectorWrapper>
  </TaskSectionDisplayDiv>
);

export default TypeSelector;
