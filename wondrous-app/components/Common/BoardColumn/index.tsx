import React from 'react';
import palette from 'theme/palette';
import Task from 'components/Common/Task';
import { ToDo } from 'components/Icons';
import { ColumnSection } from 'components/Common/ColumnSection';

import { BoardColumnWrapper, BoardColumnTitle, IconWrapper } from './styles';

export function BoardColumn({ column, setColumn }) {
  const { sections = [], tasks = [], icon = ToDo, title = '' } = column;

  const count = tasks.length;
  const Icon = icon;
  const iconStyle = {
    height: '24px',
    width: '24px',
    borderRadius: '24px',
    border: `1px solid ${palette.grey400}`,
    padding: '3px',
  };

  const setTask = (task) => {
    setColumn({
      ...column,
      tasks: tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      }),
    });
  };

  const setSection = (section) => {
    sections.filter((s) => s.id === section.id)[0] = section;
    setColumn(column);
  };

  return (
    <BoardColumnWrapper key={`${column.id}-wrapper`}>
      <BoardColumnTitle>
        <IconWrapper>
          <Icon style={iconStyle} />
        </IconWrapper>
        <span style={{ display: 'flex', fontWeight: 'bold' }}>
          {' '}
          {title} {count}{' '}
        </span>
      </BoardColumnTitle>
      {sections.map((section) => (
        <ColumnSection key={section.id} section={section} setSection={setSection} />
      ))}
      <div key={`${title}-task-list`}>
        {tasks.map((task) => (
          // TODO: setTask could be deprecated here?
          <Task key={task.id} task={task} /* setTask={setTask} */ />
        ))}
      </div>
    </BoardColumnWrapper>
  );
}
