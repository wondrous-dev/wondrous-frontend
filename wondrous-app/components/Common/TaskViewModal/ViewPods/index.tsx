import DisplayCrossPods from 'components/Common/DisplayCrossPods';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import {
  TaskCardPodIcon,
  TaskModalHeaderArrow,
  TaskModalHeaderIconWrapper,
  TaskModalHeaderTypography,
} from '../styles';

const ViewPods = ({ podName, podId, podColor, pods, handleClose }) => {
  const router = useRouter();
  if (podName || pods?.length === 1) {
    let data = {
      name: podName,
      id: podId,
      color: podColor,
    };
    if (pods?.length === 1) {
      data = pods[0];
    }
    return (
      <>
        {data?.name && (
          <>
            <TaskModalHeaderArrow />
            <TaskModalHeaderIconWrapper
              onClick={() => {
                handleClose();
                router.push(`/pod/${data?.id}/home`, undefined, {
                  shallow: true,
                });
              }}
            >
              <TaskCardPodIcon color={data?.color} />
              <TaskModalHeaderTypography>{data?.name}</TaskModalHeaderTypography>
            </TaskModalHeaderIconWrapper>
          </>
        )}
      </>
    );
  }
  if (pods?.length > 1) {
    return (
      <>
        <TaskModalHeaderArrow />
        <DisplayCrossPods
          pods={pods}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          renderPill={({ onClick }) => (
            <TaskModalHeaderIconWrapper onClick={onClick}>
              <TaskCardPodIcon color={palette.grey78} />
              <TaskModalHeaderTypography>{pods?.length} pods</TaskModalHeaderTypography>
            </TaskModalHeaderIconWrapper>
          )}
        />
      </>
    );
  }
};

export default ViewPods;
