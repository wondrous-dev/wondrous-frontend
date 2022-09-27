import { Modal } from 'components/Modal';
import CollabDetails, { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import CollabActions from 'components/CollabInvite/CollabOrgsSelect';
export default function CollabInvite({ orgRequestInfo = null }) {
  return (
    <Modal open maxWidth={560} title={'Collaboration request'}>
      <CollabDetails type={MODAL_TYPE.ACTION} request={orgRequestInfo?.getOrgCollabRequestByToken} />
      <CollabActions />
    </Modal>
  );
}
