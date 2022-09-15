import Image from 'next/image';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';

import DocumentListItem from 'components/DocumentListItem';
import ListLayout from 'components/ListLayout';
import { SectionTitleTypography, DocsButton } from './DocCategoriesSectionStyles';

function DocCategoriesSection({ onItemClick, onOpenDocDialog, docs, category, onCategoryDialogOpen, canEdit }) {
  const router = useRouter();

  const docsByCategory = docs?.filter((doc) => doc.documentCategory?.id === category.id);

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2.5} mt={4}>
        <Box mr={1}>
          <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
        </Box>

        <SectionTitleTypography>
          {router.query.username} {category.name}
        </SectionTitleTypography>
        <Box mr={1} />
        <Box flex="1" />
        {canEdit && (
          <>
            <DocsButton color="secondary" onClick={() => onCategoryDialogOpen(category)}>
              <Box mr={1}>
                <Image src="/images/icons/editFolder.png" alt="folder icon" width={18} height={14} />
              </Box>
              Edit Category
            </DocsButton>
            <Box mr={2} />
            <DocsButton color="secondary" onClick={() => onOpenDocDialog(category)}>
              <Box mr={1}>
                <Image src="/images/icons/addDoc.png" alt="folder icon" width={11} height={14} />
              </Box>
              Add Doc
            </DocsButton>
          </>
        )}
      </Box>

      <ListLayout>
        {docsByCategory?.map((doc, idx) => (
          <DocumentListItem
            key={doc.id}
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.previewPicture}
            url={doc.link}
            permission={doc.visibility}
            onClick={(e) => onItemClick(e, doc)}
          />
        ))}
      </ListLayout>
    </Box>
  );
}

export default DocCategoriesSection;
