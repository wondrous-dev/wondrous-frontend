import { ClickAwayListener, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { Input } from './styles';

const EditableText = ({ canEdit = false, value, onEdit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useRef(null);

  const toggleEditMode = () => {
    if (!canEdit) return;
    if (isEditMode) {
      onEdit(ref.current);
    }
    setIsEditMode((prev) => !prev);
  };

  if (!isEditMode) {
    return (
      <Typography
        onClick={toggleEditMode}
        fontFamily='Poppins'
        fontWeight={700}
        fontSize='13px'
        lineHeight='17px'
        color='black'
      >
        {value}
      </Typography>
    );
  }
  if (isEditMode) {
    return (
      <ClickAwayListener onClickAway={toggleEditMode} mouseEvent='onMouseDown'>
        <Input
          defaultValue={value}
          autoFocus
          onChange={(e) => (ref.current = e.target.value)}
        />
      </ClickAwayListener>
    );
  }
};

export default EditableText;
