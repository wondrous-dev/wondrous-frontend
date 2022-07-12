import { Folder } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { Text } from 'components/styled';
import { map } from 'lodash';
import { useState } from 'react';
import {
  PodSearchAutocomplete,
  PodSearchAutocompletePopper,
  TaskTemplateModal,
  TaskTemplateArrowIcon,
  TaskTemplateDeleteIcon,
  TaskTemplateClickAway,
  PodSearchDefaultImage,
  TaskTemplateLabelWrapper,
  PodSearchInput,
  PodSearchInputAdornment,
  TaskTemplateLabelValue,
  TaskTemplateLabel,
  TaskTemplateContainer,
  PodSearchListItem,
  TaskTemplateListItems,
  PodSearchPopper,
  PodSearchLabel,
  TaskTemplateIcon,
} from './styles';

const TaskTemplatePicker = (props) => {
  const { options, onChange, value, disabled } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const selectedValue = options.find((option) => option.value === value);

  const defaultTemplates = [
    {
      name: 'Template1',
      assignee: 'platona',
      title: 'Create template tasks',
      description: 'Full stack development of template tasks',
      reward: '100USD',
    },
    {
      name: 'Template1',
      assignee: 'platona',
      title: 'Create template tasks',
      description: 'Full stack development of template tasks',
      reward: '100USD',
    },
    {
      name: 'Template1',
      assignee: 'platona',
      title: 'Create template tasks',
      description: 'Full stack development of template tasks',
      reward: '100USD',
    },
  ];

  const labels = ['title', 'description', 'reward', 'assignee'];
  return (
    <TaskTemplateClickAway onClickAway={handleClickAway}>
      <div>
        <TaskTemplateModal open={open} disabled={!options || disabled} onClick={handleClick}>
          <TaskTemplateLabelWrapper>
            <TaskTemplateIcon color={'474747'} />
            <TaskTemplateLabel>{selectedValue?.label ?? `Select Template`}</TaskTemplateLabel>
          </TaskTemplateLabelWrapper>
          {selectedValue ? (
            <TaskTemplateDeleteIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <TaskTemplateArrowIcon />
          )}
        </TaskTemplateModal>
        <PodSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal={true}>
          {defaultTemplates.map((template, index) => {
            return (
              <div
                onClick={() => {
                  console.log(index);
                }}
                key={index}
              >
                <TaskTemplateContainer>
                  <PodSearchListItem>
                    <TaskTemplateIcon color={'474747'} />
                    <PodSearchLabel>{template.name}</PodSearchLabel>
                  </PodSearchListItem>
                  <TaskTemplateListItems>
                    <TaskTemplateLabelValue>{`Title: ${template.title}`}</TaskTemplateLabelValue>
                    <TaskTemplateLabelValue>{`Description: ${template.description}`}</TaskTemplateLabelValue>
                    <TaskTemplateLabelValue>{`Assignee: ${template.assignee}`}</TaskTemplateLabelValue>
                    <TaskTemplateLabelValue>{`Reward: ${template.reward}`}</TaskTemplateLabelValue>
                  </TaskTemplateListItems>
                </TaskTemplateContainer>
              </div>

              // <TaskTemplate details={template}></TaskTemplate>
            );
          })}
        </PodSearchPopper>
      </div>
    </TaskTemplateClickAway>
  );
};

export default TaskTemplatePicker;
