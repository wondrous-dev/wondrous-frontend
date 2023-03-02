import { Grid, Popover, Typography } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { MinimalPod, multiPodNormalizr } from '../DeleteMilestoneConfirm';
import PodIconName from '../PodIconName';

interface Props {
  pods: any[];
  renderPill?: ({ onClick }) => JSX.Element;
  anchorOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
}

const DisplayCrossPods = ({
  pods,
  renderPill = null,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
  transformOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
  },
}: Props) => {
  const normalizedPods: MinimalPod[] = useMemo(() => multiPodNormalizr(pods), [pods]);
  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter();

  const goToPod = (podId) => {
    router.push(`/pod/${podId}/home`, undefined, {
      shallow: true,
    });
  };
  if (isEmpty(normalizedPods)) return null;
  if (normalizedPods?.length > 1) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={(e) => setAnchorEl(null)}
          anchorOrigin={anchorOrigin}
          sx={{
            '& .MuiPopover-paper': {
              background: 'transparent',
            },
          }}
          transformOrigin={transformOrigin}
        >
          <Grid
            bgcolor={palette.grey920}
            borderRadius="6px"
            display="flex"
            direction="column"
            alignItems="flex-start"
            gap="10px"
            sx={{
              padding: '10px',
              border: `1px solid ${palette.grey79}}`,
              boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              fontFamily={typography.fontFamily}
              fontSize="11px"
              lineHeight="11px"
              fontWeight="500"
              color={palette.grey58}
            >
              This task is in {normalizedPods?.length} pods
            </Typography>
            <Grid display="flex" flexWrap="wrap" alignItems="center" gap="8px">
              {normalizedPods?.map((pod) => (
                <Grid
                  sx={{
                    flex: '1 0 40%',
                  }}
                >
                  <PodIconName
                    key={pod?.id}
                    color={pod?.color}
                    // TODO: normalize me
                    name={pod?.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPod(pod?.id);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Popover>
        {renderPill ? (
          renderPill({
            onClick: (e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            },
          })
        ) : (
          <PodIconName
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            name={`${pods?.length} pods`}
          />
        )}
      </div>
    );
  }
  return (
    <PodIconName
      color={normalizedPods[0].color}
      name={normalizedPods[0]?.name}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        goToPod(normalizedPods[0].id);
      }}
    />
  );
};

export default DisplayCrossPods;
