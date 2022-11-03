import Box from '@mui/material/Box';
import Image from 'next/legacy/image';
import GridLayout from 'components/GridLayout';
import DocumentGridItem from 'components/DocumentGridItem';
import PermissionTag from 'components/PermissionTag';

import { SectionTitleTypography, DocsButton } from './styles';

function PinnedDocsSection({ pinnedDocs, onDialogOpen, onItemClick }) {
  return (
    <Box mt={6}>
      <Box display="flex" alignItems="center" mb={2.5}>
        <Box mr={1}>
          <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
        </Box>
        <SectionTitleTypography>Pinned Docs</SectionTitleTypography>
        <Box mr={1} />
        <PermissionTag>Public</PermissionTag>
        <Box flex="1" />

        <DocsButton color="secondary" onClick={onDialogOpen}>
          <Box mr={1}>
            <Image src="/images/icons/addDoc.png" alt="folder icon" width={11} height={14} />
          </Box>
          Add Doc
        </DocsButton>
      </Box>

      <GridLayout>
        {pinnedDocs?.map((doc) => (
          <DocumentGridItem
            key={doc.id}
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.previewPicture}
            url={doc.link}
            permission={doc.visibility}
            onItemClick={(e) => onItemClick(e, doc)}
          />
        ))}
      </GridLayout>
    </Box>
  );
}

export default PinnedDocsSection;
