import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import { ListWrapper, Label } from 'components/Common/SidebarStyles';
import Link from 'next/link';
import ViewCollab from 'components/CreateCollaborationModal/ViewCollab';
import { CollabsWrapper, CollabRequestTitle, CollabRequestLogoWrapper, CollabRequestAction } from '../styles';

export default function CollabsEntityList({ items, label, type }) {
  return (
    <ListWrapper>
      <Label>{label}</Label>
      {items?.map((request, idx) => (
        <CollabsWrapper key={idx}>
          <CollabRequestTitle>{request.title}</CollabRequestTitle>
          <CollabRequestLogoWrapper>
            <SidebarTooltip title={request.initiatorOrg.username} placement="top">
              <Link href={`/organization/${request.initiatorOrg.username}/boards`} legacyBehavior>
                <OrgProfilePicture
                  profilePicture={request.initiatorOrg.profilePicture}
                  style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                />
              </Link>
            </SidebarTooltip>
            X
            <SidebarTooltip title={request.recipientOrg.username}>
              <Link href={`/organization/${request.recipientOrg.username}/boards`} legacyBehavior>
                <OrgProfilePicture
                  profilePicture={request.recipientOrg.profilePicture}
                  style={{ height: '22px', width: '22px', borderRadius: '2px' }}
                />
              </Link>
            </SidebarTooltip>
            {request.recipientOrg.username}
          </CollabRequestLogoWrapper>
          <ViewCollab orgCollabRequest={request} type={type} />
        </CollabsWrapper>
      ))}
    </ListWrapper>
  );
}
