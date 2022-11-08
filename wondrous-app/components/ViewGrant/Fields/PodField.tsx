import { useRouter } from 'next/router';
import {
  TaskModalHeaderArrow,
  TaskModalHeaderIconWrapper,
  TaskCardPodIcon,
  TaskModalHeaderTypography,
} from 'components/Common/TaskViewModal/styles';
import { filterOptionsWithPermission } from 'components/CreateEntity/CreateEntityModal/Helpers';
import PodSearch from 'components/CreateEntity/CreateEntityModal/PodSearch';
import { CreateEntityHeaderArrowIcon } from 'components/CreateEntity/CreateEntityModal/styles';
import { ENTITIES_TYPES } from 'utils/constants';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_AVAILABLE_PODS } from 'graphql/queries';
import { useEffect, useRef } from 'react';
import { useGlobalContext, useOutsideAlerter } from 'utils/hooks';
import { useEditMode } from '../hooks';

const PodField = ({ podName, podId, podColor, handleClose, orgId, handleUpdate = () => {} }) => {
  const [getAvailableUserPods, { data }] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    fetchPolicy: 'network-only',
  });

  const ref = useRef();
  const { userPermissionsContext } = useGlobalContext();
  const { isEditMode, toggleEditMode, closeEditMode } = useEditMode();

  useOutsideAlerter(ref, () => {
    closeEditMode();
  });

  useEffect(() => {
    if (isEditMode && orgId) {
      getAvailableUserPods({
        variables: {
          orgId,
        },
      });
    }
  }, [isEditMode]);

  const handleChange = () => {
    handleUpdate();
    toggleEditMode();
  };

  return (
    <>
      {!!podName && <TaskModalHeaderArrow />}
      <div ref={ref}>
        {isEditMode && (
          <PodSearch
            options={filterOptionsWithPermission(
              ENTITIES_TYPES.GRANT,
              data?.getAvailableUserPods,
              userPermissionsContext,
              orgId
            )}
            value={podId}
            onChange={handleChange}
          />
        )}
        {!isEditMode && !!podName && (
          <div onClick={toggleEditMode}>
            <TaskModalHeaderIconWrapper>
              <TaskCardPodIcon color={podColor} />
              <TaskModalHeaderTypography>{podName}</TaskModalHeaderTypography>
            </TaskModalHeaderIconWrapper>
          </div>
        )}
      </div>
    </>
  );
};

export default PodField;
