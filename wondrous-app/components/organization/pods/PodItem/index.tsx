import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PodIcon from 'components/Icons/podIcon';
import palette from 'theme/palette';
import { PodItemContainer } from './styles';
// {
//     "__typename": "Pod",
//     "id": "68333470649155631",
//     "name": "Pod to archive",
//     "username": "pod_to_archive",
//     "description": null,
//     "privacyLevel": "public",
//     "headerPicture": null,
//     "profilePicture": null,
//     "thumbnailPicture": null,
//     "createdBy": "46111082046029825",
//     "createdAt": "2022-09-25T06:11:15.903164+00:00",
//     "orgId": "46110468539940865",
//     "tags": null,
//     "contributorCount": 1,
//     "tasksCompletedCount": 0,
//     "color": "#FF8D85"
// }

const PodItem = (props) => {
  const { podData } = props;

  const bgColor = podData?.color || palette.black85;
  const podName = podData?.name;
  const podDescription = podData?.description;
  const contributorCount = podData?.contributorCount;

  return (
    <PodItemContainer>
      <Grid sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Grid sx={{ background: bgColor, padding: '10px', borderRadius: '1000px', display: 'flex' }}>
          <PodIcon />
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ color: palette.blue20, fontWeight: 700, fontSize: '15px' }}>{podName}</Typography>
          {!!podDescription && (
            <Typography sx={{ color: palette.grey250, fontSize: '14px' }}>{podDescription}</Typography>
          )}
        </Grid>
      </Grid>
      <Grid sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>yo</Grid>
    </PodItemContainer>
  );
};

export default PodItem;
