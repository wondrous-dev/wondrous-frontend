import Box from '@mui/material/Box';
import Image from 'next/image';
import GridLayout from 'components/GridLayout';
import GridItem from 'components/GridItem';
import PermissionTag from 'components/PermissionTag';

import { SAMPLE_DOCS } from 'utils/sampleData';

import { SectionTitleTypography, DocsButton } from './styles';

const PinnedDocsSection = ({ pinnedDocs, onDialogOpen }) => {
  return (
    <Box mt={6}>
      <Box display="flex" alignItems="center" mb={2.5}>
        <Box mr={1}>
          <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
        </Box>
        <SectionTitleTypography>Pinned Docs</SectionTitleTypography>
        <Box mr={1} />
        <PermissionTag>Contributors</PermissionTag>
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
          <GridItem
            key={doc.link}
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.media || SAMPLE_DOCS.media}
            url={doc.link}
            permission={doc.visibility}
          />
        ))}
      </GridLayout>
    </Box>
  );
};

export default PinnedDocsSection;
