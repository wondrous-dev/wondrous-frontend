import { useMutation } from '@apollo/client';
import { Grid, Typography } from '@mui/material';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import Divider from 'components/Divider';
import GradientHeading from 'components/GradientHeading';
import { WarningIcon } from 'components/Icons/WarningIcon';
import Modal from 'components/Modal';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { DELETE_MILESTONE, UPDATE_MILESTONE } from 'graphql/mutations';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { deleteTaskFromCache } from 'utils/helpers';
import PodIconName from '../PodIconName';

export interface MinimalPod {
  id: string;
  name: string;
  color: string;
}

export const podNormalizr = (pod) => ({
  id: pod?.podId || pod?.id,
  name: pod?.podName || pod?.name,
  color: pod?.podColor || pod?.color,
});

export const multiPodNormalizr = (pods) => pods?.map((pod) => podNormalizr(pod)) || [];

const wrapperStyle = {
  border: `1px solid ${palette.red300}`,
  bgcolor: 'rgba(249, 55, 1, 0.2)',
};

const refetchQueries = [
  'getPerStatusTaskCountForUserBoard',
  'getPerStatusTaskCountForOrgBoard',
  'getPerStatusTaskCountForPodBoard',
  'getSubtasksForTask',
  'getPerTypeTaskCountForOrgBoard',
  'getPerTypeTaskCountForPodBoard',
];

const DeleteMilestoneConfirm = ({ milestone, onClose, isOpen, podId = null }) => {
  const pods = useMemo(() => multiPodNormalizr(milestone?.pods), [milestone?.pods]);

  const [selectedPods, setSelectedPods] = useState(podId ? pods?.map((pod) => pod?.id === podId) : pods);

  const [deleteMilestone] = useMutation(DELETE_MILESTONE, {
    variables: { milestoneId: milestone?.id },
    refetchQueries,
    onCompleted: () => {
      onClose();
    },
    update: (cache) =>
      deleteTaskFromCache(cache, milestone?.id, [
        'getUserTaskBoardTasks',
        'getOrgTaskBoardTasks',
        'getPodTaskBoardTasks',
      ]),
  });

  const [updateMilestone] = useMutation(UPDATE_MILESTONE, {
    refetchQueries,
    onCompleted: () => {
      onClose();
    },
  });
  const onDelete = () => {
    if (selectedPods?.length === 0) {
      return;
    }
    if (selectedPods?.length === milestone?.pods?.length) {
      deleteMilestone();
    }

    updateMilestone({
      variables: {
        milestoneId: milestone?.id,
        input: {
          podIds: selectedPods?.map((pod) => pod?.id),
        },
      },
    });
  };

  const handlePodSelect = (pod) => {
    const isPodSelected = selectedPods.find((selectedPod) => selectedPod?.id === pod?.id);
    if (isPodSelected) {
      setSelectedPods(selectedPods.filter((selectedPod) => selectedPod?.id !== pod?.id));
    } else {
      setSelectedPods([...selectedPods, pod]);
    }
  };

  return (
    <Modal
      title="Delete milestone"
      open={isOpen}
      onClose={onClose}
      maxWidth={540}
      footerRight={
        <Grid display="flex" gap="12px">
          <Button
            onClick={onClose}
            buttonTheme={{
              background: palette.grey75,
              borderColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              paddingX: 24,
              paddingY: 8,

              hover: {
                background: palette.grey76,
              },
            }}
          >
            Cancel
          </Button>
          <HeaderButton reversed onClick={onDelete}>
            Delete milestone
          </HeaderButton>
        </Grid>
      }
    >
      <Grid display="flex" flexDirection="column" gap="14px" justifyContent="flex-start">
        <GradientHeading>This milestone is linked to {pods?.length} pods</GradientHeading>
        <Divider />
        <Grid display="flex" gap="14px" alignItems="center">
          <WarningIcon />
          <Typography
            color={palette.grey250}
            fontFamily={typography.fontFamily}
            fontSize="14px"
            fontWeight={500}
            lineHeight="24px"
          >
            This action will only delete selected instances of the milestone.
            <br />
            Please select which instances you want to delete.
          </Typography>
        </Grid>
        <Divider />
        <Grid display="flex" flexDirection="column" gap="14px">
          {pods?.map((pod) => {
            const isChecked = selectedPods.find((selectedPod) => selectedPod?.id === pod?.id);
            const checkedWrapperStyle = isChecked ? wrapperStyle : {};
            return (
              <Grid display="flex" gap="14px" alignItems="center" justifyContent="flex-start">
                <Checkbox checked={isChecked} onChange={() => handlePodSelect(pod)} />
                <PodIconName
                  key={pod?.id}
                  color={pod?.color}
                  wrapperStyle={checkedWrapperStyle}
                  name={pod?.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePodSelect(pod);
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DeleteMilestoneConfirm;
