import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_DOCS } from 'graphql/queries/documents';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

import Box from '@mui/material/Box';

import ListLayout from 'components/ListLayout';
import ListItem from 'components/ListItem';
import AddDocumentDialog from 'components/AddDocumentDialog';

import Wrapper from '../wrapper/wrapper';
import { SectionTitleTypography, DocsButton } from './docsStyles';
import PinnedDocsSection from 'components/PinnedDocsSection';
import { SAMPLE_CATEGORIES, SAMPLE_DOCS } from 'utils/sampleData';

const useGetOrgDocs = (orgId) => {
  const router = useRouter();

  const [getOrgDocs, { data, loading }] = useLazyQuery(GET_ORG_DOCS, {
    variables: {
      orgId,
    },
  });

  useEffect(() => {
    if (!data && orgId) {
      getOrgDocs();
    }
  }, [loading, orgId, getOrgDocs, data]);
  return { data: data?.getOrgDocuments, loading };
};

const Docs = (props) => {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;

  const { data } = useGetOrgDocs(orgId);

  const [showDialog, setShowDialog] = useState(false);
  const [docCategory, setDocCategory] = useState({ value: '', label: '' });

  const handleDialogOpen = (category) => {
    setShowDialog(true);
    setDocCategory(category);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDocCategory({ value: '', label: '' });
  };

  // TODO: change !doc.pinned to doc.pinned when pinned works || When trying to set up pinned = true I'm always getting pinned false

  const pinnedDocs = data?.filter((doc) => !doc.pinned);

  return (
    <Wrapper orgData={orgData}>
      {!isEmpty(pinnedDocs) && (
        <PinnedDocsSection onDialogOpen={() => handleDialogOpen(SAMPLE_CATEGORIES.PINNED)} pinnedDocs={pinnedDocs} />
      )}
      <Box display="flex" alignItems="center" mb={2.5} mt={8}>
        <Box mr={1}>
          <Image src="/images/icons/folder.png" alt="folder icon" width={16} height={14} />
        </Box>
        {/* TODO integrate category */}
        <SectionTitleTypography>WonderDAO Category</SectionTitleTypography>
        <Box mr={1} />
        <Box flex="1" />
        <DocsButton color="secondary">
          <Box mr={1}>
            <Image src="/images/icons/editFolder.png" alt="folder icon" width={18} height={14} />
          </Box>
          Edit Category
        </DocsButton>
        <Box mr={2} />
        <DocsButton color="secondary" onClick={() => handleDialogOpen(SAMPLE_CATEGORIES.FINANCIAL)}>
          <Box mr={1}>
            <Image src="/images/icons/addDoc.png" alt="folder icon" width={11} height={14} />
          </Box>
          Add Doc
        </DocsButton>
      </Box>

      <ListLayout>
        {data?.map((doc) => (
          <ListItem
            key={doc.link}
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            media={doc.media || SAMPLE_DOCS.media}
            url={doc.link}
            permission={doc.visibility}
          />
        ))}
      </ListLayout>
      <AddDocumentDialog
        open={showDialog}
        onClose={handleCloseDialog}
        title={docCategory.label}
        orgId={orgId}
        category={docCategory}
      />
    </Wrapper>
  );
};

export default Docs;
