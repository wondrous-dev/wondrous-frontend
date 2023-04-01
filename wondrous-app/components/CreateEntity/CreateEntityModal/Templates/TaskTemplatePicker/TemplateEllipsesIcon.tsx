import { useState } from 'react';
import {
  TaskTemplateEllipsesIcon,
  TaskTemplateOptionsDeleteLabel,
  TaskTemplateOptionsLabel,
  TemplateOptionsPopper,
} from './styles';

export default function TemplateEllipsesIcon({
  templateId,
  handleEditTemplate,
  handleDeleteTemplate,
}: {
  templateId: string;
  handleEditTemplate: Function;
  handleDeleteTemplate: Function;
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    event.stopPropagation();
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ zIndex: 9999, position: 'absolute', top: '8px', right: '8px' }}>
      <TaskTemplateEllipsesIcon onClick={handleClick} />
      <TemplateOptionsPopper open={open} placement="bottom-end" anchorEl={anchorEl}>
        <TaskTemplateOptionsLabel
          onClick={(event) => {
            handleEditTemplate(templateId);
            event.stopPropagation();
          }}
        >
          Edit template
        </TaskTemplateOptionsLabel>
        <TaskTemplateOptionsDeleteLabel
          onClick={(event) => {
            handleDeleteTemplate(templateId);
            event.stopPropagation();
          }}
        >
          Delete template
        </TaskTemplateOptionsDeleteLabel>
      </TemplateOptionsPopper>
    </div>
  );
}
