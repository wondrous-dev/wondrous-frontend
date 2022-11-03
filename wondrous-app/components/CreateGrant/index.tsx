import { CreateEntityForm } from 'components/CreateEntity/CreateEntityModal/styles';
import { CreateFormBaseModal } from 'components/CreateEntity/styles';
import { useState } from 'react';
import { useFullScreen, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

const CreateGrant = (props) => {
  const { toggleFullScreen, isFullScreen } = useFullScreen();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;

  return <CreateEntityForm onSubmit={() => {}} fullScreen={isFullScreen} data-cy="modal-create-grant" />;
};

export default CreateGrant;
