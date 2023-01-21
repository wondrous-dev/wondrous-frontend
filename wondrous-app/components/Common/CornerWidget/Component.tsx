import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CloseModalIcon from 'components/Icons/closeModal';
import get from 'lodash/get';
import { useRouter } from 'next/router';

import palette from 'theme/palette';
import typography from 'theme/typography';
import { ENTITIES_TYPES } from 'utils/constants';

import { CornerWidgetComponentType } from './types';

const addedToText = (type) => {
  if (type === ENTITIES_TYPES.MILESTONE) return `launched in`;
  return `added to`;
};

const useHandleOnClick = ({ id, type, orgName }) => {
  const router = useRouter();
  const entityLink = orgName ? `/organization/${router.query.username}/` : `/pod/${router.query.podId}/`;
  const handleOnClickPerType = {
    [ENTITIES_TYPES.GRANT]: () => router.push(`${entityLink}/grants?grant=${id}`),
    [ENTITIES_TYPES.DOC]: () => router.push(`${entityLink}/docs?id=${id}`),
    [ENTITIES_TYPES.PROPOSAL]: () =>
      router.push({ query: { ...router.query, taskProposal: id } }, undefined, {
        scroll: false,
      }),
  };
  const defaultHandleOnClick = () =>
    router.push({ query: { ...router.query, task: id } }, undefined, { scroll: false });
  return get(handleOnClickPerType, type, defaultHandleOnClick);
};

const CornerWidgetComponent = ({ id, type, orgName, podName, handleClose }: CornerWidgetComponentType) => {
  const entityName = podName || orgName;
  const handleOpen = useHandleOnClick({ id, type, orgName });
  const handleOnClickOpen = () => {
    handleOpen();
    handleClose();
  };
  return (
    <Grid
      container
      bgcolor={palette.grey85}
      height="48px"
      alignItems="center"
      padding="8px"
      borderRadius="6px"
      fontFamily="Space Grotesk"
      width="fit-content"
      justifyContent="space-between"
      flexDirection="row"
      gap="24px"
    >
      <Grid container item width="fit-content" gap="4px">
        <Typography fontFamily={typography.fontFamily} fontWeight="500" color={palette.grey250} fontSize="15px">
          <Box
            sx={{
              display: 'inline-block',
              textTransform: 'capitalize',
            }}
          >
            {type}
          </Box>{' '}
          {addedToText(type)}
        </Typography>
        <Typography fontFamily={typography.fontFamily} fontWeight="600" color={palette.white} fontSize="15px">
          {entityName}
        </Typography>
      </Grid>
      <Grid container item width="fit-content" alignItems="center" gap="8px">
        <Button
          onClick={handleOnClickOpen}
          sx={{
            width: 'fit-content',
            minWidth: 0,
            '&:hover': {
              background: 'transparent',
              '& > *': {
                textDecoration: 'underline',
                color: palette.blue40,
              },
            },
          }}
        >
          <Typography
            fontFamily={typography.fontFamily}
            fontWeight="600"
            color={palette.highlightBlue}
            fontSize="15px"
            textTransform="capitalize"
          >
            Open
          </Typography>
        </Button>
        <Button
          onClick={handleClose}
          sx={{
            height: '32px',
            width: '30px',
            minWidth: 0,
            background: palette.grey78,
            padding: '4px',
            borderRadius: '6px',
            '&:hover': {
              background: palette.grey58,
              svg: {
                path: { stroke: palette.white },
              },
            },
          }}
        >
          <CloseModalIcon strokeColor={palette.blue20} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default CornerWidgetComponent;
