import { SharedOrgHeaderCard } from 'components/Collaboration/SharedOrgHeader';
import SmartLink from 'components/Common/SmartLink';
import { CollabCard, CollabCardHeader, CollabDescription } from './styles';

export const ActiveCollaborationItem = (props) => {
  const { collab } = props;
  console.log('collab', collab);
  return (
    <SmartLink href={`/collaboration/${collab?.username}/boards`}>
      <CollabCard>
        <CollabCardHeader>
          <SharedOrgHeaderCard collab={collab} />
        </CollabCardHeader>
        <CollabDescription>{collab?.description}</CollabDescription>
      </CollabCard>
    </SmartLink>
  );
};
