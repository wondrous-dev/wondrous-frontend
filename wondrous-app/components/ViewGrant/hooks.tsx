import { useState } from 'react';

export const useEditMode = () => {
  const [isEditMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode((prevState) => !prevState);

  const closeEditMode = () => !isEditMode && setEditMode(false);

  return { isEditMode, toggleEditMode, setEditMode, closeEditMode };
};
